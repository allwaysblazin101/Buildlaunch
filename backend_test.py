import requests
import sys
import json
from datetime import datetime

class BuildLaunchAPITester:
    def __init__(self, base_url="https://homefixpro-5.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.homeowner_token = None
        self.contractor_token = None
        self.test_job_id = None
        self.test_bid_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_categories_and_locations(self):
        """Test categories and locations endpoints"""
        print("\n=== Testing Categories and Locations ===")
        
        success, response = self.run_test("Get Categories", "GET", "categories", 200)
        if success and 'categories' in response:
            print(f"   Found {len(response['categories'])} categories")
        
        success, response = self.run_test("Get Locations", "GET", "locations", 200)
        if success and 'locations' in response:
            print(f"   Found {len(response['locations'])} locations")

    def test_user_registration_and_login(self):
        """Test user registration and login"""
        print("\n=== Testing User Registration and Login ===")
        
        timestamp = datetime.now().strftime('%H%M%S')
        
        # Register homeowner
        homeowner_data = {
            "email": f"homeowner_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Homeowner",
            "user_type": "homeowner",
            "phone": "416-555-1234"
        }
        
        success, response = self.run_test("Register Homeowner", "POST", "auth/register", 200, homeowner_data)
        if success and 'token' in response:
            self.homeowner_token = response['token']
            print(f"   Homeowner registered with ID: {response['user']['id']}")
        
        # Register contractor
        contractor_data = {
            "email": f"contractor_{timestamp}@test.com",
            "password": "TestPass123!",
            "full_name": "Test Contractor",
            "user_type": "contractor",
            "phone": "416-555-5678"
        }
        
        success, response = self.run_test("Register Contractor", "POST", "auth/register", 200, contractor_data)
        if success and 'token' in response:
            self.contractor_token = response['token']
            print(f"   Contractor registered with ID: {response['user']['id']}")
        
        # Test login
        login_data = {
            "email": homeowner_data["email"],
            "password": homeowner_data["password"]
        }
        
        success, response = self.run_test("Login Homeowner", "POST", "auth/login", 200, login_data)
        if success and 'token' in response:
            print(f"   Login successful for homeowner")

    def test_auth_endpoints(self):
        """Test authenticated endpoints"""
        print("\n=== Testing Auth Endpoints ===")
        
        if self.homeowner_token:
            success, response = self.run_test("Get User Profile", "GET", "auth/me", 200, token=self.homeowner_token)
            if success:
                print(f"   Profile retrieved for: {response.get('full_name')}")

    def test_contractor_verification(self):
        """Test contractor verification"""
        print("\n=== Testing Contractor Verification ===")
        
        if self.contractor_token:
            verification_data = {
                "license_number": "LIC123456",
                "insurance_info": "Insurance Company ABC - Policy #789",
                "company_name": "Test Contracting Inc",
                "years_experience": 5,
                "specialties": ["Kitchen Renovation", "Bathroom Renovation"]
            }
            
            success, response = self.run_test(
                "Update Contractor Verification", 
                "PUT", 
                "auth/contractor-verification", 
                200, 
                verification_data, 
                self.contractor_token
            )
            if success:
                print(f"   Contractor verification updated, verified: {response.get('verified')}")

    def test_job_management(self):
        """Test job posting and management"""
        print("\n=== Testing Job Management ===")
        
        if self.homeowner_token:
            # Create job
            job_data = {
                "title": "Kitchen Renovation in Mississauga",
                "description": "Complete kitchen renovation including cabinets, countertops, and appliances. Looking for experienced contractor.",
                "location": "Mississauga",
                "category": "Kitchen Renovation",
                "budget_min": 15000,
                "budget_max": 25000,
                "start_date": "2025-02-15"
            }
            
            success, response = self.run_test("Create Job", "POST", "jobs", 200, job_data, self.homeowner_token)
            if success and 'id' in response:
                self.test_job_id = response['id']
                print(f"   Job created with ID: {self.test_job_id}")
            
            # Get jobs list
            success, response = self.run_test("Get Jobs List", "GET", "jobs", 200)
            if success:
                print(f"   Found {len(response)} jobs in list")
            
            # Get specific job
            if self.test_job_id:
                success, response = self.run_test("Get Job Details", "GET", f"jobs/{self.test_job_id}", 200)
                if success:
                    print(f"   Job details retrieved: {response.get('title')}")
            
            # Get my jobs
            success, response = self.run_test("Get My Jobs", "GET", "jobs/my-jobs", 200, token=self.homeowner_token)
            if success:
                print(f"   Found {len(response)} jobs for homeowner")

    def test_bidding_system(self):
        """Test bidding system"""
        print("\n=== Testing Bidding System ===")
        
        if self.contractor_token and self.test_job_id:
            # Submit bid
            bid_data = {
                "amount": 20000,
                "message": "I have 5 years of experience in kitchen renovations. I can complete this project within your timeline.",
                "estimated_days": 14
            }
            
            success, response = self.run_test(
                "Submit Bid", 
                "POST", 
                f"jobs/{self.test_job_id}/bids", 
                200, 
                bid_data, 
                self.contractor_token
            )
            if success and 'id' in response:
                self.test_bid_id = response['id']
                print(f"   Bid submitted with ID: {self.test_bid_id}")
            
            # Get contractor's bids
            success, response = self.run_test("Get My Bids", "GET", "bids/my-bids", 200, token=self.contractor_token)
            if success:
                print(f"   Found {len(response)} bids for contractor")
        
        if self.homeowner_token and self.test_job_id:
            # Get job bids (homeowner view)
            success, response = self.run_test(
                "Get Job Bids", 
                "GET", 
                f"jobs/{self.test_job_id}/bids", 
                200, 
                token=self.homeowner_token
            )
            if success:
                print(f"   Found {len(response)} bids for job")

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        print("\n=== Testing Dashboard Stats ===")
        
        if self.homeowner_token:
            success, response = self.run_test("Homeowner Dashboard Stats", "GET", "stats/dashboard", 200, token=self.homeowner_token)
            if success:
                print(f"   Homeowner stats - Total jobs: {response.get('total_jobs', 0)}")
        
        if self.contractor_token:
            success, response = self.run_test("Contractor Dashboard Stats", "GET", "stats/dashboard", 200, token=self.contractor_token)
            if success:
                print(f"   Contractor stats - Total bids: {response.get('total_bids', 0)}")

    def test_messaging_system(self):
        """Test messaging system"""
        print("\n=== Testing Messaging System ===")
        
        if self.homeowner_token and self.contractor_token:
            # Get homeowner user ID first
            success, homeowner_profile = self.run_test("Get Homeowner Profile", "GET", "auth/me", 200, token=self.homeowner_token)
            success, contractor_profile = self.run_test("Get Contractor Profile", "GET", "auth/me", 200, token=self.contractor_token)
            
            if homeowner_profile and contractor_profile:
                # Send message from contractor to homeowner
                message_data = {
                    "receiver_id": homeowner_profile['id'],
                    "job_id": self.test_job_id,
                    "content": "Hello! I'm interested in your kitchen renovation project. I have some questions about the timeline."
                }
                
                success, response = self.run_test(
                    "Send Message", 
                    "POST", 
                    "messages", 
                    200, 
                    message_data, 
                    self.contractor_token
                )
                if success:
                    print(f"   Message sent successfully")
                
                # Get conversations
                success, response = self.run_test("Get Conversations", "GET", "messages/conversations", 200, token=self.homeowner_token)
                if success:
                    print(f"   Found {len(response)} conversations")

    def test_escrow_payment_creation(self):
        """Test escrow payment creation (without actual payment)"""
        print("\n=== Testing Escrow Payment Creation ===")
        
        if self.homeowner_token and self.test_job_id:
            payment_data = {
                "job_id": self.test_job_id,
                "origin_url": "https://homefixpro-5.preview.emergentagent.com"
            }
            
            success, response = self.run_test(
                "Create Escrow Payment", 
                "POST", 
                "payments/escrow/create", 
                200, 
                payment_data, 
                self.homeowner_token
            )
            if success and 'checkout_url' in response:
                print(f"   Escrow payment session created successfully")
                print(f"   Checkout URL generated: {response['checkout_url'][:50]}...")

def main():
    print("🚀 Starting Build Launch API Testing...")
    print("=" * 50)
    
    tester = BuildLaunchAPITester()
    
    # Run all tests
    tester.test_categories_and_locations()
    tester.test_user_registration_and_login()
    tester.test_auth_endpoints()
    tester.test_contractor_verification()
    tester.test_job_management()
    tester.test_bidding_system()
    tester.test_dashboard_stats()
    tester.test_messaging_system()
    tester.test_escrow_payment_creation()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   • {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n✨ Success Rate: {success_rate:.1f}%")
    
    return 0 if success_rate >= 80 else 1

if __name__ == "__main__":
    sys.exit(main())