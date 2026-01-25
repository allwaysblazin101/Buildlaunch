from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
import hashlib
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from collections import defaultdict
import jwt
import bcrypt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'buildlaunch_secret_key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Stripe Config
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
PLATFORM_FEE_PERCENT = 10

# Admin Config
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@buildlaunch.ca')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'BuildLaunch2024!')

# Resend Email Config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Rate Limiting (in-memory for simplicity)
login_attempts = defaultdict(list)
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION = 300  # 5 minutes

# Create the main app
app = FastAPI(title="Build Launch API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============= Models =============

def validate_password_strength(password: str) -> bool:
    """Check password meets minimum security requirements"""
    if len(password) < 8:
        return False
    if not re.search(r'[A-Za-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: str  # 'homeowner', 'contractor', or 'admin'
    phone: Optional[str] = None
    
    @validator('password')
    def password_strength(cls, v):
        if not validate_password_strength(v):
            raise ValueError('Password must be at least 8 characters with letters and numbers')
        return v
    
    @validator('user_type')
    def valid_user_type(cls, v):
        if v not in ['homeowner', 'contractor']:
            raise ValueError('User type must be homeowner or contractor')
        return v

class ContractorVerification(BaseModel):
    license_number: Optional[str] = None
    insurance_info: Optional[str] = None
    company_name: Optional[str] = None
    years_experience: Optional[int] = None
    specialties: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    user_type: str
    phone: Optional[str] = None
    verified: bool = False
    verification: Optional[ContractorVerification] = None
    created_at: str

class JobCreate(BaseModel):
    title: str
    description: str
    location: str  # Mississauga, Toronto, Brampton
    category: str
    budget_min: float
    budget_max: float
    start_date: Optional[str] = None
    images: Optional[List[str]] = []

class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    location: str
    category: str
    budget_min: float
    budget_max: float
    start_date: Optional[str] = None
    images: List[str] = []
    status: str  # 'open', 'in_escrow', 'awarded', 'in_progress', 'completed', 'cancelled'
    homeowner_id: str
    homeowner_name: str
    escrow_amount: Optional[float] = None
    awarded_contractor_id: Optional[str] = None
    created_at: str
    bid_count: int = 0

class BidCreate(BaseModel):
    amount: float
    message: str
    estimated_days: int

class BidResponse(BaseModel):
    id: str
    job_id: str
    contractor_id: str
    contractor_name: str
    amount: float
    message: str
    estimated_days: int
    status: str  # 'pending', 'accepted', 'rejected'
    created_at: str

class MessageCreate(BaseModel):
    receiver_id: str
    job_id: Optional[str] = None
    content: str

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    sender_name: str
    receiver_id: str
    job_id: Optional[str] = None
    content: str
    read: bool = False
    created_at: str

class ReviewCreate(BaseModel):
    contractor_id: str
    job_id: str
    rating: int  # 1-5
    comment: str

class ReviewResponse(BaseModel):
    id: str
    homeowner_id: str
    homeowner_name: str
    contractor_id: str
    job_id: str
    rating: int
    comment: str
    created_at: str

class EscrowPaymentRequest(BaseModel):
    job_id: str
    origin_url: str

class PaymentReleaseRequest(BaseModel):
    job_id: str

# ============= Auth Helpers =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str, user_type: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "user_type": user_type,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def check_rate_limit(email: str) -> bool:
    """Check if user is rate limited. Returns True if allowed, False if blocked."""
    now = datetime.now(timezone.utc).timestamp()
    # Clean old attempts
    login_attempts[email] = [t for t in login_attempts[email] if now - t < LOCKOUT_DURATION]
    # Check if too many attempts
    if len(login_attempts[email]) >= MAX_LOGIN_ATTEMPTS:
        return False
    return True

def record_login_attempt(email: str):
    """Record a failed login attempt"""
    login_attempts[email].append(datetime.now(timezone.utc).timestamp())

def clear_login_attempts(email: str):
    """Clear login attempts after successful login"""
    login_attempts[email] = []

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify user is an admin"""
    user = await get_current_user(credentials)
    if user.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============= Auth Endpoints =============

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "user_type": user_data.user_type,
        "phone": user_data.phone,
        "verified": False,
        "verification": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    # Log registration
    logger.info(f"New user registered: {user_data.email} as {user_data.user_type}")
    
    token = create_token(user_id, user_data.email, user_data.user_type)
    return {
        "token": token,
        "user": {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "user_type": user_data.user_type,
            "phone": user_data.phone,
            "verified": False
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    # Check rate limiting
    if not check_rate_limit(credentials.email):
        logger.warning(f"Rate limit exceeded for: {credentials.email}")
        raise HTTPException(status_code=429, detail="Too many login attempts. Please try again in 5 minutes.")
    
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        record_login_attempt(credentials.email)
        logger.warning(f"Failed login attempt for: {credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Clear rate limit on successful login
    clear_login_attempts(credentials.email)
    logger.info(f"User logged in: {credentials.email}")
    
    token = create_token(user["id"], user["email"], user["user_type"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "user_type": user["user_type"],
            "phone": user.get("phone"),
            "verified": user.get("verified", False),
            "verification": user.get("verification")
        }
    }

@api_router.post("/auth/admin-login")
async def admin_login(credentials: UserLogin):
    """Special login endpoint for admin users"""
    # Check rate limiting
    if not check_rate_limit(credentials.email):
        raise HTTPException(status_code=429, detail="Too many login attempts. Please try again in 5 minutes.")
    
    # Check if admin credentials match env vars (for initial admin)
    if credentials.email == ADMIN_EMAIL and credentials.password == ADMIN_PASSWORD:
        # Create or get admin user
        admin = await db.users.find_one({"email": ADMIN_EMAIL, "user_type": "admin"}, {"_id": 0})
        if not admin:
            admin_id = str(uuid.uuid4())
            admin_doc = {
                "id": admin_id,
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "full_name": "Build Launch Admin",
                "user_type": "admin",
                "phone": "416-697-1728",
                "verified": True,
                "verification": None,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(admin_doc)
            admin = admin_doc
        
        clear_login_attempts(credentials.email)
        logger.info(f"Admin logged in: {credentials.email}")
        token = create_token(admin["id"], admin["email"], "admin")
        return {
            "token": token,
            "user": {
                "id": admin["id"],
                "email": admin["email"],
                "full_name": admin["full_name"],
                "user_type": "admin",
                "verified": True
            }
        }
    
    # Check database for admin user
    admin = await db.users.find_one({"email": credentials.email, "user_type": "admin"}, {"_id": 0})
    if not admin or not verify_password(credentials.password, admin["password_hash"]):
        record_login_attempt(credentials.email)
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    
    clear_login_attempts(credentials.email)
    token = create_token(admin["id"], admin["email"], "admin")
    return {
        "token": token,
        "user": {
            "id": admin["id"],
            "email": admin["email"],
            "full_name": admin["full_name"],
            "user_type": "admin",
            "verified": True
        }
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "user_type": user["user_type"],
        "phone": user.get("phone"),
        "verified": user.get("verified", False),
        "verification": user.get("verification")
    }

@api_router.put("/auth/profile")
async def update_profile(updates: dict, user: dict = Depends(get_current_user)):
    allowed_fields = ["full_name", "phone"]
    update_data = {k: v for k, v in updates.items() if k in allowed_fields}
    if update_data:
        await db.users.update_one({"id": user["id"]}, {"$set": update_data})
    updated_user = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return updated_user

@api_router.put("/auth/contractor-verification")
async def update_contractor_verification(verification: ContractorVerification, user: dict = Depends(get_current_user)):
    if user["user_type"] != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can update verification")
    
    verification_dict = verification.model_dump()
    verified = bool(verification.license_number and verification.insurance_info)
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"verification": verification_dict, "verified": verified}}
    )
    return {"message": "Verification updated", "verified": verified}

# ============= Jobs Endpoints =============

@api_router.post("/jobs")
async def create_job(job_data: JobCreate, user: dict = Depends(get_current_user)):
    if user["user_type"] != "homeowner":
        raise HTTPException(status_code=403, detail="Only homeowners can post jobs")
    
    job_id = str(uuid.uuid4())
    job_doc = {
        "id": job_id,
        "title": job_data.title,
        "description": job_data.description,
        "location": job_data.location,
        "category": job_data.category,
        "budget_min": job_data.budget_min,
        "budget_max": job_data.budget_max,
        "start_date": job_data.start_date,
        "images": job_data.images or [],
        "status": "open",
        "homeowner_id": user["id"],
        "homeowner_name": user["full_name"],
        "escrow_amount": None,
        "awarded_contractor_id": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.jobs.insert_one(job_doc)
    return {"id": job_id, "message": "Job posted successfully"}

@api_router.get("/jobs")
async def get_jobs(
    location: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    min_budget: Optional[float] = None,
    max_budget: Optional[float] = None
):
    query = {}
    if location:
        query["location"] = location
    if category:
        query["category"] = category
    if status:
        query["status"] = status
    else:
        query["status"] = {"$in": ["open", "in_escrow"]}
    if min_budget:
        query["budget_max"] = {"$gte": min_budget}
    if max_budget:
        query["budget_min"] = {"$lte": max_budget}
    
    jobs = await db.jobs.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for job in jobs:
        bid_count = await db.bids.count_documents({"job_id": job["id"]})
        job["bid_count"] = bid_count
    
    return jobs

@api_router.get("/jobs/my-jobs")
async def get_my_jobs(user: dict = Depends(get_current_user)):
    if user["user_type"] == "homeowner":
        jobs = await db.jobs.find({"homeowner_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    else:
        bid_job_ids = await db.bids.distinct("job_id", {"contractor_id": user["id"]})
        awarded_jobs = await db.jobs.find({"awarded_contractor_id": user["id"]}, {"_id": 0}).to_list(100)
        bid_jobs = await db.jobs.find({"id": {"$in": bid_job_ids}}, {"_id": 0}).to_list(100)
        jobs = awarded_jobs + [j for j in bid_jobs if j["id"] not in [a["id"] for a in awarded_jobs]]
    
    for job in jobs:
        bid_count = await db.bids.count_documents({"job_id": job["id"]})
        job["bid_count"] = bid_count
    
    return jobs

@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    bid_count = await db.bids.count_documents({"job_id": job_id})
    job["bid_count"] = bid_count
    
    return job

@api_router.put("/jobs/{job_id}")
async def update_job(job_id: str, updates: dict, user: dict = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    allowed_fields = ["title", "description", "location", "category", "budget_min", "budget_max", "start_date", "images"]
    update_data = {k: v for k, v in updates.items() if k in allowed_fields}
    if update_data:
        await db.jobs.update_one({"id": job_id}, {"$set": update_data})
    
    return {"message": "Job updated"}

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, user: dict = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    if job["status"] not in ["open"]:
        raise HTTPException(status_code=400, detail="Cannot delete job that's already in progress")
    
    await db.jobs.delete_one({"id": job_id})
    await db.bids.delete_many({"job_id": job_id})
    return {"message": "Job deleted"}

# ============= Bids Endpoints =============

@api_router.post("/jobs/{job_id}/bids")
async def create_bid(job_id: str, bid_data: BidCreate, user: dict = Depends(get_current_user)):
    if user["user_type"] != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can bid")
    
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] not in ["open", "in_escrow"]:
        raise HTTPException(status_code=400, detail="Job is not accepting bids")
    
    existing_bid = await db.bids.find_one({"job_id": job_id, "contractor_id": user["id"]})
    if existing_bid:
        raise HTTPException(status_code=400, detail="You already bid on this job")
    
    bid_id = str(uuid.uuid4())
    bid_doc = {
        "id": bid_id,
        "job_id": job_id,
        "contractor_id": user["id"],
        "contractor_name": user["full_name"],
        "amount": bid_data.amount,
        "message": bid_data.message,
        "estimated_days": bid_data.estimated_days,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.bids.insert_one(bid_doc)
    return {"id": bid_id, "message": "Bid submitted successfully"}

@api_router.get("/jobs/{job_id}/bids")
async def get_job_bids(job_id: str, user: dict = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if user["user_type"] == "homeowner" and job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view bids")
    
    bids = await db.bids.find({"job_id": job_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for bid in bids:
        contractor = await db.users.find_one({"id": bid["contractor_id"]}, {"_id": 0, "password_hash": 0})
        if contractor:
            bid["contractor_verified"] = contractor.get("verified", False)
            bid["contractor_verification"] = contractor.get("verification")
    
    return bids

@api_router.get("/bids/my-bids")
async def get_my_bids(user: dict = Depends(get_current_user)):
    if user["user_type"] != "contractor":
        raise HTTPException(status_code=403, detail="Only contractors can view their bids")
    
    bids = await db.bids.find({"contractor_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for bid in bids:
        job = await db.jobs.find_one({"id": bid["job_id"]}, {"_id": 0})
        if job:
            bid["job_title"] = job["title"]
            bid["job_status"] = job["status"]
            bid["job_location"] = job["location"]
    
    return bids

@api_router.put("/bids/{bid_id}/accept")
async def accept_bid(bid_id: str, user: dict = Depends(get_current_user)):
    bid = await db.bids.find_one({"id": bid_id}, {"_id": 0})
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    
    job = await db.jobs.find_one({"id": bid["job_id"]}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    if job["status"] != "in_escrow":
        raise HTTPException(status_code=400, detail="Payment must be in escrow before accepting bid")
    
    await db.bids.update_one({"id": bid_id}, {"$set": {"status": "accepted"}})
    await db.bids.update_many({"job_id": bid["job_id"], "id": {"$ne": bid_id}}, {"$set": {"status": "rejected"}})
    await db.jobs.update_one({"id": bid["job_id"]}, {"$set": {"status": "awarded", "awarded_contractor_id": bid["contractor_id"]}})
    
    return {"message": "Bid accepted, job awarded"}

# ============= Escrow Payment Endpoints =============

@api_router.post("/payments/escrow/create")
async def create_escrow_payment(payment_req: EscrowPaymentRequest, request: Request, user: dict = Depends(get_current_user)):
    if user["user_type"] != "homeowner":
        raise HTTPException(status_code=403, detail="Only homeowners can fund escrow")
    
    job = await db.jobs.find_one({"id": payment_req.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your job")
    if job["status"] != "open":
        raise HTTPException(status_code=400, detail="Job already has payment or is closed")
    
    amount = job["budget_max"]
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{payment_req.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payment_req.origin_url}/jobs/{payment_req.job_id}"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(amount),
        currency="cad",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "job_id": payment_req.job_id,
            "user_id": user["id"],
            "payment_type": "escrow"
        }
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    transaction_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "job_id": payment_req.job_id,
        "user_id": user["id"],
        "amount": float(amount),
        "currency": "cad",
        "payment_type": "escrow",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction_doc)
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def check_payment_status(session_id: str, user: dict = Depends(get_current_user)):
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction["payment_status"] == "paid":
        return {"status": "paid", "job_id": transaction["job_id"]}
    
    host_url = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        if checkout_status.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "status": "complete"}}
            )
            await db.jobs.update_one(
                {"id": transaction["job_id"]},
                {"$set": {"status": "in_escrow", "escrow_amount": transaction["amount"]}}
            )
            return {"status": "paid", "job_id": transaction["job_id"]}
        elif checkout_status.status == "expired":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "expired", "status": "expired"}}
            )
            return {"status": "expired", "job_id": transaction["job_id"]}
        else:
            return {"status": "pending", "job_id": transaction["job_id"]}
    except Exception as e:
        logger.error(f"Error checking payment status: {e}")
        return {"status": transaction["payment_status"], "job_id": transaction["job_id"]}

@api_router.post("/payments/release")
async def release_payment(release_req: PaymentReleaseRequest, user: dict = Depends(get_current_user)):
    if user["user_type"] != "homeowner":
        raise HTTPException(status_code=403, detail="Only homeowners can release payment")
    
    job = await db.jobs.find_one({"id": release_req.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your job")
    if job["status"] != "awarded":
        raise HTTPException(status_code=400, detail="Job must be awarded before releasing payment")
    
    escrow_amount = job.get("escrow_amount", 0)
    platform_fee = escrow_amount * (PLATFORM_FEE_PERCENT / 100)
    contractor_payout = escrow_amount - platform_fee
    
    await db.jobs.update_one(
        {"id": release_req.job_id},
        {"$set": {"status": "completed"}}
    )
    
    payout_doc = {
        "id": str(uuid.uuid4()),
        "job_id": release_req.job_id,
        "contractor_id": job["awarded_contractor_id"],
        "escrow_amount": escrow_amount,
        "platform_fee": platform_fee,
        "contractor_payout": contractor_payout,
        "status": "released",
        "released_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payouts.insert_one(payout_doc)
    
    return {
        "message": "Payment released",
        "escrow_amount": escrow_amount,
        "platform_fee": platform_fee,
        "contractor_payout": contractor_payout
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    body = await request.body()
    
    try:
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        webhook_response = await stripe_checkout.handle_webhook(body, stripe_signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
            
            if transaction and transaction["payment_status"] != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "paid", "status": "complete"}}
                )
                await db.jobs.update_one(
                    {"id": transaction["job_id"]},
                    {"$set": {"status": "in_escrow", "escrow_amount": transaction["amount"]}}
                )
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ============= Messages Endpoints =============

@api_router.post("/messages")
async def send_message(msg_data: MessageCreate, user: dict = Depends(get_current_user)):
    receiver = await db.users.find_one({"id": msg_data.receiver_id}, {"_id": 0})
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    msg_id = str(uuid.uuid4())
    msg_doc = {
        "id": msg_id,
        "sender_id": user["id"],
        "sender_name": user["full_name"],
        "receiver_id": msg_data.receiver_id,
        "job_id": msg_data.job_id,
        "content": msg_data.content,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.messages.insert_one(msg_doc)
    return {"id": msg_id, "message": "Message sent"}

@api_router.get("/messages")
async def get_messages(user: dict = Depends(get_current_user)):
    messages = await db.messages.find(
        {"$or": [{"sender_id": user["id"]}, {"receiver_id": user["id"]}]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(200)
    return messages

@api_router.get("/messages/conversations")
async def get_conversations(user: dict = Depends(get_current_user)):
    messages = await db.messages.find(
        {"$or": [{"sender_id": user["id"]}, {"receiver_id": user["id"]}]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    
    conversations = {}
    for msg in messages:
        other_id = msg["receiver_id"] if msg["sender_id"] == user["id"] else msg["sender_id"]
        if other_id not in conversations:
            other_user = await db.users.find_one({"id": other_id}, {"_id": 0, "password_hash": 0})
            conversations[other_id] = {
                "user_id": other_id,
                "user_name": other_user["full_name"] if other_user else "Unknown",
                "user_type": other_user["user_type"] if other_user else "unknown",
                "last_message": msg["content"],
                "last_message_time": msg["created_at"],
                "unread_count": 0
            }
        if msg["receiver_id"] == user["id"] and not msg["read"]:
            conversations[other_id]["unread_count"] += 1
    
    return list(conversations.values())

@api_router.get("/messages/{other_user_id}")
async def get_conversation_messages(other_user_id: str, user: dict = Depends(get_current_user)):
    messages = await db.messages.find(
        {"$or": [
            {"sender_id": user["id"], "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": user["id"]}
        ]},
        {"_id": 0}
    ).sort("created_at", 1).to_list(200)
    
    await db.messages.update_many(
        {"sender_id": other_user_id, "receiver_id": user["id"], "read": False},
        {"$set": {"read": True}}
    )
    
    return messages

# ============= Reviews Endpoints =============

@api_router.post("/reviews")
async def create_review(review_data: ReviewCreate, user: dict = Depends(get_current_user)):
    if user["user_type"] != "homeowner":
        raise HTTPException(status_code=403, detail="Only homeowners can leave reviews")
    
    job = await db.jobs.find_one({"id": review_data.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["homeowner_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your job")
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job must be completed first")
    
    existing = await db.reviews.find_one({"job_id": review_data.job_id, "homeowner_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Already reviewed")
    
    review_id = str(uuid.uuid4())
    review_doc = {
        "id": review_id,
        "homeowner_id": user["id"],
        "homeowner_name": user["full_name"],
        "contractor_id": review_data.contractor_id,
        "job_id": review_data.job_id,
        "rating": review_data.rating,
        "comment": review_data.comment,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.reviews.insert_one(review_doc)
    return {"id": review_id, "message": "Review submitted"}

@api_router.get("/reviews/contractor/{contractor_id}")
async def get_contractor_reviews(contractor_id: str):
    reviews = await db.reviews.find({"contractor_id": contractor_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    if reviews:
        avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
    else:
        avg_rating = 0
    
    return {"reviews": reviews, "average_rating": round(avg_rating, 1), "total_reviews": len(reviews)}

# ============= Stats Endpoints =============

@api_router.get("/stats/dashboard")
async def get_dashboard_stats(user: dict = Depends(get_current_user)):
    if user["user_type"] == "homeowner":
        total_jobs = await db.jobs.count_documents({"homeowner_id": user["id"]})
        active_jobs = await db.jobs.count_documents({"homeowner_id": user["id"], "status": {"$in": ["open", "in_escrow", "awarded"]}})
        completed_jobs = await db.jobs.count_documents({"homeowner_id": user["id"], "status": "completed"})
        total_spent_pipeline = [
            {"$match": {"homeowner_id": user["id"], "status": "completed"}},
            {"$group": {"_id": None, "total": {"$sum": "$escrow_amount"}}}
        ]
        total_spent_result = await db.jobs.aggregate(total_spent_pipeline).to_list(1)
        total_spent = total_spent_result[0]["total"] if total_spent_result else 0
        
        return {
            "total_jobs": total_jobs,
            "active_jobs": active_jobs,
            "completed_jobs": completed_jobs,
            "total_spent": total_spent
        }
    else:
        total_bids = await db.bids.count_documents({"contractor_id": user["id"]})
        accepted_bids = await db.bids.count_documents({"contractor_id": user["id"], "status": "accepted"})
        jobs_completed = await db.jobs.count_documents({"awarded_contractor_id": user["id"], "status": "completed"})
        
        earnings_pipeline = [
            {"$match": {"contractor_id": user["id"], "status": "released"}},
            {"$group": {"_id": None, "total": {"$sum": "$contractor_payout"}}}
        ]
        earnings_result = await db.payouts.aggregate(earnings_pipeline).to_list(1)
        total_earnings = earnings_result[0]["total"] if earnings_result else 0
        
        reviews_data = await get_contractor_reviews(user["id"])
        
        return {
            "total_bids": total_bids,
            "accepted_bids": accepted_bids,
            "jobs_completed": jobs_completed,
            "total_earnings": total_earnings,
            "average_rating": reviews_data["average_rating"],
            "total_reviews": reviews_data["total_reviews"]
        }

@api_router.get("/contractors/{contractor_id}")
async def get_contractor_profile(contractor_id: str):
    contractor = await db.users.find_one({"id": contractor_id, "user_type": "contractor"}, {"_id": 0, "password_hash": 0})
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    
    reviews_data = await get_contractor_reviews(contractor_id)
    completed_jobs = await db.jobs.count_documents({"awarded_contractor_id": contractor_id, "status": "completed"})
    
    return {
        **contractor,
        "average_rating": reviews_data["average_rating"],
        "total_reviews": reviews_data["total_reviews"],
        "completed_jobs": completed_jobs
    }

# ============= Categories =============

JOB_CATEGORIES = [
    "Kitchen Renovation",
    "Bathroom Renovation", 
    "Basement Finishing",
    "Flooring",
    "Painting",
    "Roofing",
    "Plumbing",
    "Electrical",
    "HVAC",
    "Windows & Doors",
    "Deck & Patio",
    "Landscaping",
    "General Contracting",
    "Other"
]

LOCATIONS = ["Mississauga", "Toronto", "Brampton"]

@api_router.get("/categories")
async def get_categories():
    return {"categories": JOB_CATEGORIES}

@api_router.get("/locations")
async def get_locations():
    return {"locations": LOCATIONS}

# ============= Admin Endpoints =============

@api_router.get("/admin/stats")
async def get_admin_stats(admin: dict = Depends(get_admin_user)):
    """Get platform-wide statistics for admin dashboard"""
    total_users = await db.users.count_documents({"user_type": {"$ne": "admin"}})
    total_homeowners = await db.users.count_documents({"user_type": "homeowner"})
    total_contractors = await db.users.count_documents({"user_type": "contractor"})
    verified_contractors = await db.users.count_documents({"user_type": "contractor", "verified": True})
    
    total_jobs = await db.jobs.count_documents({})
    open_jobs = await db.jobs.count_documents({"status": "open"})
    in_escrow_jobs = await db.jobs.count_documents({"status": "in_escrow"})
    completed_jobs = await db.jobs.count_documents({"status": "completed"})
    
    total_bids = await db.bids.count_documents({})
    
    # Revenue calculations
    revenue_pipeline = [
        {"$match": {"status": "released"}},
        {"$group": {"_id": None, "total_escrow": {"$sum": "$escrow_amount"}, "total_fees": {"$sum": "$platform_fee"}}}
    ]
    revenue_result = await db.payouts.aggregate(revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total_fees"] if revenue_result else 0
    total_escrow = revenue_result[0]["total_escrow"] if revenue_result else 0
    
    # Recent activity
    recent_jobs = await db.jobs.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    recent_users = await db.users.find({"user_type": {"$ne": "admin"}}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).limit(5).to_list(5)
    
    return {
        "users": {
            "total": total_users,
            "homeowners": total_homeowners,
            "contractors": total_contractors,
            "verified_contractors": verified_contractors
        },
        "jobs": {
            "total": total_jobs,
            "open": open_jobs,
            "in_escrow": in_escrow_jobs,
            "completed": completed_jobs
        },
        "bids": {
            "total": total_bids
        },
        "revenue": {
            "total_platform_fees": total_revenue,
            "total_escrow_processed": total_escrow
        },
        "recent_jobs": recent_jobs,
        "recent_users": recent_users
    }

@api_router.get("/admin/users")
async def get_all_users(
    admin: dict = Depends(get_admin_user),
    user_type: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    """Get all users with filtering"""
    query = {"user_type": {"$ne": "admin"}}
    if user_type:
        query["user_type"] = user_type
    
    users = await db.users.find(query, {"_id": 0, "password_hash": 0}).skip(skip).limit(limit).to_list(limit)
    total = await db.users.count_documents(query)
    
    return {"users": users, "total": total}

@api_router.get("/admin/jobs")
async def get_all_jobs(
    admin: dict = Depends(get_admin_user),
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    """Get all jobs with filtering"""
    query = {}
    if status:
        query["status"] = status
    
    jobs = await db.jobs.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.jobs.count_documents(query)
    
    return {"jobs": jobs, "total": total}

@api_router.get("/admin/payments")
async def get_all_payments(
    admin: dict = Depends(get_admin_user),
    limit: int = 50,
    skip: int = 0
):
    """Get all payment transactions"""
    transactions = await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    payouts = await db.payouts.find({}, {"_id": 0}).sort("released_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return {"transactions": transactions, "payouts": payouts}

@api_router.put("/admin/users/{user_id}/verify")
async def admin_verify_contractor(user_id: str, admin: dict = Depends(get_admin_user)):
    """Admin can manually verify a contractor"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["user_type"] != "contractor":
        raise HTTPException(status_code=400, detail="Can only verify contractors")
    
    await db.users.update_one({"id": user_id}, {"$set": {"verified": True}})
    logger.info(f"Admin verified contractor: {user_id}")
    return {"message": "Contractor verified successfully"}

@api_router.put("/admin/users/{user_id}/suspend")
async def admin_suspend_user(user_id: str, admin: dict = Depends(get_admin_user)):
    """Admin can suspend a user"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.users.update_one({"id": user_id}, {"$set": {"suspended": True}})
    logger.info(f"Admin suspended user: {user_id}")
    return {"message": "User suspended successfully"}

@api_router.put("/admin/users/{user_id}/unsuspend")
async def admin_unsuspend_user(user_id: str, admin: dict = Depends(get_admin_user)):
    """Admin can unsuspend a user"""
    await db.users.update_one({"id": user_id}, {"$set": {"suspended": False}})
    logger.info(f"Admin unsuspended user: {user_id}")
    return {"message": "User unsuspended successfully"}

@api_router.delete("/admin/jobs/{job_id}")
async def admin_delete_job(job_id: str, admin: dict = Depends(get_admin_user)):
    """Admin can delete a job"""
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job["status"] in ["in_escrow", "awarded"]:
        raise HTTPException(status_code=400, detail="Cannot delete job with active escrow. Resolve first.")
    
    await db.jobs.delete_one({"id": job_id})
    await db.bids.delete_many({"job_id": job_id})
    logger.info(f"Admin deleted job: {job_id}")
    return {"message": "Job deleted successfully"}

@api_router.post("/admin/jobs/{job_id}/resolve")
async def admin_resolve_dispute(job_id: str, resolution: dict, admin: dict = Depends(get_admin_user)):
    """Admin can resolve disputes and release/refund escrow"""
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    action = resolution.get("action")  # 'release_to_contractor', 'refund_to_homeowner', 'split'
    
    if action == "release_to_contractor" and job["awarded_contractor_id"]:
        escrow_amount = job.get("escrow_amount", 0)
        platform_fee = escrow_amount * (PLATFORM_FEE_PERCENT / 100)
        contractor_payout = escrow_amount - platform_fee
        
        payout_doc = {
            "id": str(uuid.uuid4()),
            "job_id": job_id,
            "contractor_id": job["awarded_contractor_id"],
            "escrow_amount": escrow_amount,
            "platform_fee": platform_fee,
            "contractor_payout": contractor_payout,
            "status": "released",
            "resolved_by_admin": True,
            "released_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payouts.insert_one(payout_doc)
        await db.jobs.update_one({"id": job_id}, {"$set": {"status": "completed"}})
        logger.info(f"Admin resolved dispute - released to contractor: {job_id}")
        return {"message": "Payment released to contractor", "payout": contractor_payout}
    
    elif action == "refund_to_homeowner":
        await db.jobs.update_one({"id": job_id}, {"$set": {"status": "cancelled", "escrow_amount": 0}})
        logger.info(f"Admin resolved dispute - refunded to homeowner: {job_id}")
        return {"message": "Refund initiated for homeowner"}
    
    raise HTTPException(status_code=400, detail="Invalid resolution action")

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
