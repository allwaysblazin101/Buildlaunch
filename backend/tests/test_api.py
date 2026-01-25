"""
Build Launch API Tests - Comprehensive backend testing
Tests: Auth, Jobs, Bids, Contractors, Admin, Categories/Locations
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_HOMEOWNER_EMAIL = f"test_homeowner_{uuid.uuid4().hex[:8]}@test.com"
TEST_CONTRACTOR_EMAIL = f"test_contractor_{uuid.uuid4().hex[:8]}@test.com"
TEST_PASSWORD = "TestPass123"
ADMIN_EMAIL = "admin@buildlaunch.ca"
ADMIN_PASSWORD = "BuildLaunch2024!"


class TestHealthAndBasics:
    """Basic API health checks"""
    
    def test_categories_endpoint(self):
        """Test /api/categories returns valid categories"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert "categories" in data
        assert len(data["categories"]) > 0
        assert "Kitchen Renovation" in data["categories"]
        print(f"✓ Categories endpoint working - {len(data['categories'])} categories")
    
    def test_locations_endpoint(self):
        """Test /api/locations returns valid locations"""
        response = requests.get(f"{BASE_URL}/api/locations")
        assert response.status_code == 200
        data = response.json()
        assert "locations" in data
        assert "Mississauga" in data["locations"]
        assert "Toronto" in data["locations"]
        assert "Brampton" in data["locations"]
        print(f"✓ Locations endpoint working - {data['locations']}")
    
    def test_jobs_list_public(self):
        """Test /api/jobs returns jobs list (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Jobs list endpoint working - {len(data)} jobs")


class TestUserRegistration:
    """User registration tests"""
    
    def test_register_homeowner(self):
        """Test homeowner registration"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_HOMEOWNER_EMAIL,
            "password": TEST_PASSWORD,
            "full_name": "Test Homeowner",
            "user_type": "homeowner"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_HOMEOWNER_EMAIL
        assert data["user"]["user_type"] == "homeowner"
        print(f"✓ Homeowner registration successful - {TEST_HOMEOWNER_EMAIL}")
        return data["token"]
    
    def test_register_contractor(self):
        """Test contractor registration"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_CONTRACTOR_EMAIL,
            "password": TEST_PASSWORD,
            "full_name": "Test Contractor",
            "user_type": "contractor"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_CONTRACTOR_EMAIL
        assert data["user"]["user_type"] == "contractor"
        print(f"✓ Contractor registration successful - {TEST_CONTRACTOR_EMAIL}")
        return data["token"]
    
    def test_register_duplicate_email(self):
        """Test duplicate email registration fails"""
        # First registration
        email = f"test_dup_{uuid.uuid4().hex[:8]}@test.com"
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Test User",
            "user_type": "homeowner"
        })
        # Second registration with same email
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Test User 2",
            "user_type": "homeowner"
        })
        assert response.status_code == 400
        print("✓ Duplicate email registration correctly rejected")
    
    def test_register_weak_password(self):
        """Test weak password is rejected"""
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": f"test_weak_{uuid.uuid4().hex[:8]}@test.com",
            "password": "weak",
            "full_name": "Test User",
            "user_type": "homeowner"
        })
        assert response.status_code == 422  # Validation error
        print("✓ Weak password correctly rejected")


class TestUserLogin:
    """User login tests"""
    
    def test_login_homeowner(self):
        """Test homeowner login"""
        # First register
        email = f"test_login_{uuid.uuid4().hex[:8]}@test.com"
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Test Login User",
            "user_type": "homeowner"
        })
        # Then login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        print("✓ Homeowner login successful")
        return data["token"]
    
    def test_login_invalid_credentials(self):
        """Test invalid credentials are rejected"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")
    
    def test_admin_login(self):
        """Test admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/admin-login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["user_type"] == "admin"
        print("✓ Admin login successful")
        return data["token"]


class TestAuthenticatedEndpoints:
    """Tests requiring authentication"""
    
    @pytest.fixture
    def homeowner_token(self):
        """Get homeowner token"""
        email = f"test_ho_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Test Homeowner",
            "user_type": "homeowner"
        })
        return response.json()["token"]
    
    @pytest.fixture
    def contractor_token(self):
        """Get contractor token"""
        email = f"test_co_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Test Contractor",
            "user_type": "contractor"
        })
        return response.json()["token"]
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(f"{BASE_URL}/api/auth/admin-login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_get_me(self, homeowner_token):
        """Test /api/auth/me endpoint"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {homeowner_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "user_type" in data
        print("✓ Get current user endpoint working")
    
    def test_update_profile(self, homeowner_token):
        """Test profile update"""
        response = requests.put(f"{BASE_URL}/api/auth/profile", 
            headers={"Authorization": f"Bearer {homeowner_token}"},
            json={"full_name": "Updated Name", "phone": "416-555-1234"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "Updated Name"
        print("✓ Profile update working")
    
    def test_dashboard_stats_homeowner(self, homeowner_token):
        """Test homeowner dashboard stats"""
        response = requests.get(f"{BASE_URL}/api/stats/dashboard", headers={
            "Authorization": f"Bearer {homeowner_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "total_jobs" in data
        assert "active_jobs" in data
        print("✓ Homeowner dashboard stats working")
    
    def test_dashboard_stats_contractor(self, contractor_token):
        """Test contractor dashboard stats"""
        response = requests.get(f"{BASE_URL}/api/stats/dashboard", headers={
            "Authorization": f"Bearer {contractor_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "total_bids" in data
        assert "total_earnings" in data
        print("✓ Contractor dashboard stats working")


class TestJobsCRUD:
    """Job CRUD operations"""
    
    @pytest.fixture
    def homeowner_token(self):
        email = f"test_job_ho_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Job Test Homeowner",
            "user_type": "homeowner"
        })
        return response.json()["token"]
    
    @pytest.fixture
    def contractor_token(self):
        email = f"test_job_co_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Job Test Contractor",
            "user_type": "contractor"
        })
        return response.json()["token"]
    
    def test_create_job(self, homeowner_token):
        """Test job creation"""
        response = requests.post(f"{BASE_URL}/api/jobs",
            headers={"Authorization": f"Bearer {homeowner_token}"},
            json={
                "title": "TEST_Kitchen Renovation",
                "description": "Complete kitchen renovation including cabinets and countertops",
                "location": "Mississauga",
                "category": "Kitchen Renovation",
                "budget_min": 15000,
                "budget_max": 25000
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Job created successfully - ID: {data['id']}")
        return data["id"]
    
    def test_get_job(self, homeowner_token):
        """Test get single job"""
        # Create job first
        create_res = requests.post(f"{BASE_URL}/api/jobs",
            headers={"Authorization": f"Bearer {homeowner_token}"},
            json={
                "title": "TEST_Get Job Test",
                "description": "Test job for get endpoint",
                "location": "Toronto",
                "category": "Painting",
                "budget_min": 5000,
                "budget_max": 10000
            }
        )
        job_id = create_res.json()["id"]
        
        # Get job
        response = requests.get(f"{BASE_URL}/api/jobs/{job_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == job_id
        assert data["title"] == "TEST_Get Job Test"
        print("✓ Get job endpoint working")
    
    def test_get_my_jobs(self, homeowner_token):
        """Test get my jobs"""
        response = requests.get(f"{BASE_URL}/api/jobs/my-jobs",
            headers={"Authorization": f"Bearer {homeowner_token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✓ Get my jobs endpoint working")
    
    def test_contractor_cannot_create_job(self, contractor_token):
        """Test contractor cannot create job"""
        response = requests.post(f"{BASE_URL}/api/jobs",
            headers={"Authorization": f"Bearer {contractor_token}"},
            json={
                "title": "TEST_Should Fail",
                "description": "This should fail",
                "location": "Toronto",
                "category": "Painting",
                "budget_min": 1000,
                "budget_max": 2000
            }
        )
        assert response.status_code == 403
        print("✓ Contractor correctly blocked from creating jobs")
    
    def test_jobs_filter_by_location(self):
        """Test jobs filtering by location"""
        response = requests.get(f"{BASE_URL}/api/jobs?location=Mississauga")
        assert response.status_code == 200
        data = response.json()
        for job in data:
            assert job["location"] == "Mississauga"
        print(f"✓ Location filter working - {len(data)} jobs in Mississauga")
    
    def test_jobs_filter_by_category(self):
        """Test jobs filtering by category"""
        response = requests.get(f"{BASE_URL}/api/jobs?category=Kitchen%20Renovation")
        assert response.status_code == 200
        data = response.json()
        for job in data:
            assert job["category"] == "Kitchen Renovation"
        print(f"✓ Category filter working - {len(data)} Kitchen Renovation jobs")


class TestBids:
    """Bid operations"""
    
    @pytest.fixture
    def setup_job_and_users(self):
        """Setup homeowner, contractor, and job"""
        # Create homeowner
        ho_email = f"test_bid_ho_{uuid.uuid4().hex[:8]}@test.com"
        ho_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": ho_email,
            "password": TEST_PASSWORD,
            "full_name": "Bid Test Homeowner",
            "user_type": "homeowner"
        })
        ho_token = ho_res.json()["token"]
        
        # Create contractor
        co_email = f"test_bid_co_{uuid.uuid4().hex[:8]}@test.com"
        co_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": co_email,
            "password": TEST_PASSWORD,
            "full_name": "Bid Test Contractor",
            "user_type": "contractor"
        })
        co_token = co_res.json()["token"]
        co_id = co_res.json()["user"]["id"]
        
        # Create job
        job_res = requests.post(f"{BASE_URL}/api/jobs",
            headers={"Authorization": f"Bearer {ho_token}"},
            json={
                "title": "TEST_Bid Test Job",
                "description": "Job for testing bids",
                "location": "Brampton",
                "category": "Plumbing",
                "budget_min": 3000,
                "budget_max": 5000
            }
        )
        job_id = job_res.json()["id"]
        
        return {"ho_token": ho_token, "co_token": co_token, "co_id": co_id, "job_id": job_id}
    
    def test_create_bid(self, setup_job_and_users):
        """Test bid creation"""
        response = requests.post(
            f"{BASE_URL}/api/jobs/{setup_job_and_users['job_id']}/bids",
            headers={"Authorization": f"Bearer {setup_job_and_users['co_token']}"},
            json={
                "amount": 4000,
                "message": "I can complete this job professionally",
                "estimated_days": 5
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print(f"✓ Bid created successfully - ID: {data['id']}")
    
    def test_homeowner_cannot_bid(self, setup_job_and_users):
        """Test homeowner cannot bid"""
        response = requests.post(
            f"{BASE_URL}/api/jobs/{setup_job_and_users['job_id']}/bids",
            headers={"Authorization": f"Bearer {setup_job_and_users['ho_token']}"},
            json={
                "amount": 4000,
                "message": "Should fail",
                "estimated_days": 5
            }
        )
        assert response.status_code == 403
        print("✓ Homeowner correctly blocked from bidding")
    
    def test_get_my_bids(self, setup_job_and_users):
        """Test get my bids for contractor"""
        # First create a bid
        requests.post(
            f"{BASE_URL}/api/jobs/{setup_job_and_users['job_id']}/bids",
            headers={"Authorization": f"Bearer {setup_job_and_users['co_token']}"},
            json={"amount": 4000, "message": "Test bid", "estimated_days": 5}
        )
        
        # Get my bids
        response = requests.get(f"{BASE_URL}/api/bids/my-bids",
            headers={"Authorization": f"Bearer {setup_job_and_users['co_token']}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Get my bids working - {len(data)} bids")


class TestContractorProfile:
    """Contractor profile endpoint tests"""
    
    def test_get_contractor_profile_not_found(self):
        """Test contractor profile returns 404 for invalid ID"""
        response = requests.get(f"{BASE_URL}/api/contractors/invalid-id-12345")
        assert response.status_code == 404
        print("✓ Contractor profile correctly returns 404 for invalid ID")
    
    def test_get_contractor_profile_valid(self):
        """Test contractor profile for valid contractor"""
        # First create a contractor
        email = f"test_profile_co_{uuid.uuid4().hex[:8]}@test.com"
        reg_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Profile Test Contractor",
            "user_type": "contractor"
        })
        contractor_id = reg_res.json()["user"]["id"]
        
        # Get profile
        response = requests.get(f"{BASE_URL}/api/contractors/{contractor_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == contractor_id
        assert data["full_name"] == "Profile Test Contractor"
        assert "average_rating" in data
        assert "total_reviews" in data
        assert "completed_jobs" in data
        print(f"✓ Contractor profile endpoint working - {data['full_name']}")
    
    def test_contractor_reviews(self):
        """Test contractor reviews endpoint"""
        # Create contractor
        email = f"test_review_co_{uuid.uuid4().hex[:8]}@test.com"
        reg_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Review Test Contractor",
            "user_type": "contractor"
        })
        contractor_id = reg_res.json()["user"]["id"]
        
        # Get reviews
        response = requests.get(f"{BASE_URL}/api/reviews/contractor/{contractor_id}")
        assert response.status_code == 200
        data = response.json()
        assert "reviews" in data
        assert "average_rating" in data
        assert "total_reviews" in data
        print("✓ Contractor reviews endpoint working")


class TestContractorVerification:
    """Contractor verification tests"""
    
    def test_update_verification(self):
        """Test contractor verification update"""
        # Create contractor
        email = f"test_verify_co_{uuid.uuid4().hex[:8]}@test.com"
        reg_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Verify Test Contractor",
            "user_type": "contractor"
        })
        token = reg_res.json()["token"]
        
        # Update verification
        response = requests.put(f"{BASE_URL}/api/auth/contractor-verification",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "license_number": "LIC-12345",
                "insurance_info": "INS-67890",
                "company_name": "Test Contracting Inc",
                "years_experience": 10,
                "specialties": ["Kitchen Renovation", "Bathroom Renovation"]
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["verified"] == True
        print("✓ Contractor verification update working")


class TestAdminEndpoints:
    """Admin endpoint tests"""
    
    @pytest.fixture
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/auth/admin-login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_admin_stats(self, admin_token):
        """Test admin stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "jobs" in data
        assert "revenue" in data
        print(f"✓ Admin stats working - {data['users']['total']} users, {data['jobs']['total']} jobs")
    
    def test_admin_users_list(self, admin_token):
        """Test admin users list"""
        response = requests.get(f"{BASE_URL}/api/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "total" in data
        print(f"✓ Admin users list working - {data['total']} users")
    
    def test_admin_jobs_list(self, admin_token):
        """Test admin jobs list"""
        response = requests.get(f"{BASE_URL}/api/admin/jobs",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "jobs" in data
        assert "total" in data
        print(f"✓ Admin jobs list working - {data['total']} jobs")
    
    def test_non_admin_blocked(self):
        """Test non-admin users blocked from admin endpoints"""
        # Create regular user
        email = f"test_nonadmin_{uuid.uuid4().hex[:8]}@test.com"
        reg_res = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email,
            "password": TEST_PASSWORD,
            "full_name": "Non Admin User",
            "user_type": "homeowner"
        })
        token = reg_res.json()["token"]
        
        # Try admin endpoint
        response = requests.get(f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
        print("✓ Non-admin correctly blocked from admin endpoints")


class TestMessages:
    """Messaging tests"""
    
    @pytest.fixture
    def two_users(self):
        """Create two users for messaging"""
        # User 1
        email1 = f"test_msg1_{uuid.uuid4().hex[:8]}@test.com"
        res1 = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email1,
            "password": TEST_PASSWORD,
            "full_name": "Message User 1",
            "user_type": "homeowner"
        })
        
        # User 2
        email2 = f"test_msg2_{uuid.uuid4().hex[:8]}@test.com"
        res2 = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": email2,
            "password": TEST_PASSWORD,
            "full_name": "Message User 2",
            "user_type": "contractor"
        })
        
        return {
            "user1_token": res1.json()["token"],
            "user1_id": res1.json()["user"]["id"],
            "user2_token": res2.json()["token"],
            "user2_id": res2.json()["user"]["id"]
        }
    
    def test_send_message(self, two_users):
        """Test sending a message"""
        response = requests.post(f"{BASE_URL}/api/messages",
            headers={"Authorization": f"Bearer {two_users['user1_token']}"},
            json={
                "receiver_id": two_users["user2_id"],
                "content": "Hello, I'm interested in your services"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        print("✓ Message sent successfully")
    
    def test_get_messages(self, two_users):
        """Test getting messages"""
        # Send a message first
        requests.post(f"{BASE_URL}/api/messages",
            headers={"Authorization": f"Bearer {two_users['user1_token']}"},
            json={
                "receiver_id": two_users["user2_id"],
                "content": "Test message"
            }
        )
        
        # Get messages
        response = requests.get(f"{BASE_URL}/api/messages",
            headers={"Authorization": f"Bearer {two_users['user1_token']}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✓ Get messages working")
    
    def test_get_conversations(self, two_users):
        """Test getting conversations"""
        response = requests.get(f"{BASE_URL}/api/messages/conversations",
            headers={"Authorization": f"Bearer {two_users['user1_token']}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print("✓ Get conversations working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
