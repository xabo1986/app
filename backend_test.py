#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for SvenskPå3 Swedish Learning App
Tests all authentication, profile, progress, and contact endpoints
"""

import requests
import json
import time
from datetime import datetime, timedelta
import os

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
API_BASE = f"{BASE_URL}/api"

class SvenskPa3APITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_user_email = f"testuser_{int(time.time())}@example.com"
        self.test_user_password = "TestPassword123!"
        self.test_user_display_name = "Test Användare"
        self.auth_token = None
        self.user_id = None
        
    def log_test(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        print()
        
    def make_request(self, method, endpoint, data=None, expect_success=True):
        """Make HTTP request and handle response"""
        url = f"{API_BASE}/{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            print(f"   Request: {method} {url}")
            if data:
                print(f"   Data: {json.dumps(data, indent=2)}")
            print(f"   Response Status: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
            except:
                print(f"   Response: {response.text}")
                response_data = {}
                
            return response, response_data
            
        except Exception as e:
            print(f"   Error making request: {str(e)}")
            return None, {}

    def test_auth_signup_success(self):
        """Test successful user signup"""
        print("🧪 Testing Authentication Signup - Success Case")
        
        data = {
            "email": self.test_user_email,
            "password": self.test_user_password,
            "displayName": self.test_user_display_name
        }
        
        response, response_data = self.make_request('POST', 'auth/signup', data)
        
        if response and response.status_code == 200:
            if response_data.get('success') and response_data.get('user'):
                user = response_data['user']
                self.user_id = user.get('id')
                # Check if cookie is set
                cookies = response.cookies
                has_token_cookie = 'token' in cookies
                self.log_test("Auth Signup Success", True, 
                            f"User created with ID: {self.user_id}, Token cookie set: {has_token_cookie}")
                return True
            else:
                self.log_test("Auth Signup Success", False, "Missing success or user in response")
                return False
        else:
            self.log_test("Auth Signup Success", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_auth_signup_duplicate_email(self):
        """Test signup with duplicate email"""
        print("🧪 Testing Authentication Signup - Duplicate Email")
        
        data = {
            "email": self.test_user_email,  # Same email as before
            "password": "AnotherPassword123!",
            "displayName": "Another User"
        }
        
        response, response_data = self.make_request('POST', 'auth/signup', data)
        
        if response and response.status_code == 400:
            if 'allerede registrert' in response_data.get('error', '').lower():
                self.log_test("Auth Signup Duplicate Email", True, "Correctly rejected duplicate email")
                return True
            else:
                self.log_test("Auth Signup Duplicate Email", False, "Wrong error message")
                return False
        else:
            self.log_test("Auth Signup Duplicate Email", False, f"Expected 400, got {response.status_code if response else 'No response'}")
            return False

    def test_auth_signup_missing_fields(self):
        """Test signup with missing required fields"""
        print("🧪 Testing Authentication Signup - Missing Fields")
        
        data = {
            "email": f"incomplete_{int(time.time())}@example.com"
            # Missing password
        }
        
        response, response_data = self.make_request('POST', 'auth/signup', data)
        
        if response and response.status_code == 400:
            if 'påkrevd' in response_data.get('error', '').lower():
                self.log_test("Auth Signup Missing Fields", True, "Correctly rejected missing password")
                return True
            else:
                self.log_test("Auth Signup Missing Fields", False, "Wrong error message")
                return False
        else:
            self.log_test("Auth Signup Missing Fields", False, f"Expected 400, got {response.status_code if response else 'No response'}")
            return False

    def test_auth_signin_success(self):
        """Test successful signin"""
        print("🧪 Testing Authentication Signin - Success Case")
        
        data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        response, response_data = self.make_request('POST', 'auth/signin', data)
        
        if response and response.status_code == 200:
            if response_data.get('success') and response_data.get('user'):
                # Check if cookie is set
                cookies = response.cookies
                has_token_cookie = 'token' in cookies
                self.log_test("Auth Signin Success", True, 
                            f"User signed in successfully, Token cookie set: {has_token_cookie}")
                return True
            else:
                self.log_test("Auth Signin Success", False, "Missing success or user in response")
                return False
        else:
            self.log_test("Auth Signin Success", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_auth_signin_wrong_password(self):
        """Test signin with wrong password"""
        print("🧪 Testing Authentication Signin - Wrong Password")
        
        data = {
            "email": self.test_user_email,
            "password": "WrongPassword123!"
        }
        
        response, response_data = self.make_request('POST', 'auth/signin', data)
        
        if response and response.status_code == 401:
            if 'ugyldig' in response_data.get('error', '').lower():
                self.log_test("Auth Signin Wrong Password", True, "Correctly rejected wrong password")
                return True
            else:
                self.log_test("Auth Signin Wrong Password", False, "Wrong error message")
                return False
        else:
            self.log_test("Auth Signin Wrong Password", False, f"Expected 401, got {response.status_code if response else 'No response'}")
            return False

    def test_auth_me_with_token(self):
        """Test getting user info with valid token"""
        print("🧪 Testing Authentication Me - With Valid Token")
        
        response, response_data = self.make_request('GET', 'auth/me')
        
        if response and response.status_code == 200:
            if response_data.get('id') and response_data.get('email'):
                self.log_test("Auth Me With Token", True, 
                            f"User info retrieved: {response_data.get('email')}")
                return True
            else:
                self.log_test("Auth Me With Token", False, "Missing user data in response")
                return False
        else:
            self.log_test("Auth Me With Token", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_auth_me_without_token(self):
        """Test getting user info without token"""
        print("🧪 Testing Authentication Me - Without Token")
        
        # Create new session without cookies
        temp_session = requests.Session()
        url = f"{API_BASE}/auth/me"
        
        try:
            response = temp_session.get(url)
            print(f"   Request: GET {url}")
            print(f"   Response Status: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
            except:
                response_data = {}
                
            if response.status_code == 401:
                if 'autorisert' in response_data.get('error', '').lower():
                    self.log_test("Auth Me Without Token", True, "Correctly rejected unauthorized request")
                    return True
                else:
                    self.log_test("Auth Me Without Token", False, "Wrong error message")
                    return False
            else:
                self.log_test("Auth Me Without Token", False, f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Auth Me Without Token", False, f"Error: {str(e)}")
            return False

    def test_profile_get_authenticated(self):
        """Test getting profile for authenticated user"""
        print("🧪 Testing Profile Get - Authenticated User")
        
        response, response_data = self.make_request('GET', 'profile')
        
        if response and response.status_code == 200:
            expected_fields = ['displayName', 'level', 'goal', 'scenarios', 'plan']
            has_all_fields = all(field in response_data for field in expected_fields)
            
            if has_all_fields:
                self.log_test("Profile Get Authenticated", True, 
                            f"Profile retrieved with all fields: {list(response_data.keys())}")
                return True
            else:
                missing_fields = [f for f in expected_fields if f not in response_data]
                self.log_test("Profile Get Authenticated", False, f"Missing fields: {missing_fields}")
                return False
        else:
            self.log_test("Profile Get Authenticated", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_profile_update_valid_data(self):
        """Test updating profile with valid data"""
        print("🧪 Testing Profile Update - Valid Data")
        
        data = {
            "displayName": "Uppdaterat Namn",
            "level": "intermediate",
            "goal": "Jag vill lära mig svenska för jobbet",
            "scenarios": ["butikk", "jobb", "restaurang"]
        }
        
        response, response_data = self.make_request('PUT', 'profile', data)
        
        if response and response.status_code == 200:
            if response_data.get('success'):
                self.log_test("Profile Update Valid Data", True, "Profile updated successfully")
                return True
            else:
                self.log_test("Profile Update Valid Data", False, "Missing success in response")
                return False
        else:
            self.log_test("Profile Update Valid Data", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_profile_get_without_auth(self):
        """Test getting profile without authentication"""
        print("🧪 Testing Profile Get - Without Authentication")
        
        # Create new session without cookies
        temp_session = requests.Session()
        url = f"{API_BASE}/profile"
        
        try:
            response = temp_session.get(url)
            print(f"   Request: GET {url}")
            print(f"   Response Status: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
            except:
                response_data = {}
                
            if response.status_code == 401:
                self.log_test("Profile Get Without Auth", True, "Correctly rejected unauthorized request")
                return True
            else:
                self.log_test("Profile Get Without Auth", False, f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Profile Get Without Auth", False, f"Error: {str(e)}")
            return False

    def test_progress_get_new_user(self):
        """Test getting progress for new user"""
        print("🧪 Testing Progress Get - New User")
        
        response, response_data = self.make_request('GET', 'progress')
        
        if response and response.status_code == 200:
            expected_fields = ['progress', 'currentStreak', 'totalXP', 'completedToday']
            has_all_fields = all(field in response_data for field in expected_fields)
            
            if has_all_fields:
                # For new user, should have empty progress
                progress = response_data.get('progress', [])
                current_streak = response_data.get('currentStreak', 0)
                total_xp = response_data.get('totalXP', 0)
                completed_today = response_data.get('completedToday', False)
                
                self.log_test("Progress Get New User", True, 
                            f"Progress: {len(progress)} entries, Streak: {current_streak}, XP: {total_xp}, Today: {completed_today}")
                return True
            else:
                missing_fields = [f for f in expected_fields if f not in response_data]
                self.log_test("Progress Get New User", False, f"Missing fields: {missing_fields}")
                return False
        else:
            self.log_test("Progress Get New User", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_progress_complete_lesson_first_time(self):
        """Test completing today's lesson for the first time"""
        print("🧪 Testing Progress Complete Lesson - First Time Today")
        
        data = {
            "xpEarned": 15
        }
        
        response, response_data = self.make_request('POST', 'progress', data)
        
        if response and response.status_code == 200:
            if response_data.get('success'):
                streak = response_data.get('streak', 0)
                xp_earned = response_data.get('xpEarned', 0)
                self.log_test("Progress Complete Lesson First Time", True, 
                            f"Lesson completed - Streak: {streak}, XP: {xp_earned}")
                return True
            else:
                self.log_test("Progress Complete Lesson First Time", False, "Missing success in response")
                return False
        else:
            self.log_test("Progress Complete Lesson First Time", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_progress_complete_lesson_already_completed(self):
        """Test completing lesson again same day (should fail)"""
        print("🧪 Testing Progress Complete Lesson - Already Completed Today")
        
        data = {
            "xpEarned": 10
        }
        
        response, response_data = self.make_request('POST', 'progress', data)
        
        if response and response.status_code == 400:
            if 'allerede fullført' in response_data.get('error', '').lower():
                self.log_test("Progress Complete Lesson Already Completed", True, "Correctly rejected duplicate completion")
                return True
            else:
                self.log_test("Progress Complete Lesson Already Completed", False, "Wrong error message")
                return False
        else:
            self.log_test("Progress Complete Lesson Already Completed", False, f"Expected 400, got {response.status_code if response else 'No response'}")
            return False

    def test_progress_verify_streak_and_xp(self):
        """Test that progress shows updated streak and XP"""
        print("🧪 Testing Progress Verify Streak and XP")
        
        response, response_data = self.make_request('GET', 'progress')
        
        if response and response.status_code == 200:
            current_streak = response_data.get('currentStreak', 0)
            total_xp = response_data.get('totalXP', 0)
            completed_today = response_data.get('completedToday', False)
            progress_entries = response_data.get('progress', [])
            
            # Should have streak of 1 (first day), XP of 15, and completed today
            if current_streak >= 1 and total_xp >= 15 and completed_today:
                self.log_test("Progress Verify Streak and XP", True, 
                            f"Correct values - Streak: {current_streak}, XP: {total_xp}, Completed: {completed_today}, Entries: {len(progress_entries)}")
                return True
            else:
                self.log_test("Progress Verify Streak and XP", False, 
                            f"Incorrect values - Streak: {current_streak}, XP: {total_xp}, Completed: {completed_today}")
                return False
        else:
            self.log_test("Progress Verify Streak and XP", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_progress_get_without_auth(self):
        """Test getting progress without authentication"""
        print("🧪 Testing Progress Get - Without Authentication")
        
        # Create new session without cookies
        temp_session = requests.Session()
        url = f"{API_BASE}/progress"
        
        try:
            response = temp_session.get(url)
            print(f"   Request: GET {url}")
            print(f"   Response Status: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"   Response: {json.dumps(response_data, indent=2)}")
            except:
                response_data = {}
                
            if response.status_code == 401:
                self.log_test("Progress Get Without Auth", True, "Correctly rejected unauthorized request")
                return True
            else:
                self.log_test("Progress Get Without Auth", False, f"Expected 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Progress Get Without Auth", False, f"Error: {str(e)}")
            return False

    def test_contact_form_valid_data(self):
        """Test submitting contact form with valid data"""
        print("🧪 Testing Contact Form - Valid Data")
        
        data = {
            "email": "contact@example.com",
            "message": "Hej! Jag har en fråga om appen. Kan ni hjälpa mig?"
        }
        
        response, response_data = self.make_request('POST', 'contact', data)
        
        if response and response.status_code == 200:
            if response_data.get('success'):
                self.log_test("Contact Form Valid Data", True, "Contact form submitted successfully")
                return True
            else:
                self.log_test("Contact Form Valid Data", False, "Missing success in response")
                return False
        else:
            self.log_test("Contact Form Valid Data", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_contact_form_missing_fields(self):
        """Test submitting contact form with missing fields"""
        print("🧪 Testing Contact Form - Missing Fields")
        
        data = {
            "email": "incomplete@example.com"
            # Missing message
        }
        
        response, response_data = self.make_request('POST', 'contact', data)
        
        if response and response.status_code == 400:
            if 'påkrevd' in response_data.get('error', '').lower():
                self.log_test("Contact Form Missing Fields", True, "Correctly rejected missing message")
                return True
            else:
                self.log_test("Contact Form Missing Fields", False, "Wrong error message")
                return False
        else:
            self.log_test("Contact Form Missing Fields", False, f"Expected 400, got {response.status_code if response else 'No response'}")
            return False

    def test_auth_logout(self):
        """Test logout functionality"""
        print("🧪 Testing Authentication Logout")
        
        response, response_data = self.make_request('POST', 'auth/logout')
        
        if response and response.status_code == 200:
            if response_data.get('success'):
                # Check if cookie is cleared
                cookies = response.cookies
                token_cookie = cookies.get('token')
                cookie_cleared = token_cookie == '' or token_cookie is None
                
                self.log_test("Auth Logout", True, f"Logout successful, Cookie cleared: {cookie_cleared}")
                return True
            else:
                self.log_test("Auth Logout", False, "Missing success in response")
                return False
        else:
            self.log_test("Auth Logout", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting SvenskPå3 Backend API Testing")
        print("=" * 60)
        print(f"Base URL: {BASE_URL}")
        print(f"API Base: {API_BASE}")
        print(f"Test User Email: {self.test_user_email}")
        print("=" * 60)
        print()
        
        test_results = []
        
        # Authentication Tests
        print("📋 AUTHENTICATION TESTS")
        print("-" * 30)
        test_results.append(self.test_auth_signup_success())
        test_results.append(self.test_auth_signup_duplicate_email())
        test_results.append(self.test_auth_signup_missing_fields())
        test_results.append(self.test_auth_signin_success())
        test_results.append(self.test_auth_signin_wrong_password())
        test_results.append(self.test_auth_me_with_token())
        test_results.append(self.test_auth_me_without_token())
        
        # Profile Tests
        print("📋 PROFILE TESTS")
        print("-" * 30)
        test_results.append(self.test_profile_get_authenticated())
        test_results.append(self.test_profile_update_valid_data())
        test_results.append(self.test_profile_get_without_auth())
        
        # Progress Tests
        print("📋 PROGRESS TESTS")
        print("-" * 30)
        test_results.append(self.test_progress_get_new_user())
        test_results.append(self.test_progress_complete_lesson_first_time())
        test_results.append(self.test_progress_complete_lesson_already_completed())
        test_results.append(self.test_progress_verify_streak_and_xp())
        test_results.append(self.test_progress_get_without_auth())
        
        # Contact Tests
        print("📋 CONTACT TESTS")
        print("-" * 30)
        test_results.append(self.test_contact_form_valid_data())
        test_results.append(self.test_contact_form_missing_fields())
        
        # Logout Test
        print("📋 LOGOUT TEST")
        print("-" * 30)
        test_results.append(self.test_auth_logout())
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(test_results)
        total = len(test_results)
        failed = total - passed
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed} ✅")
        print(f"Failed: {failed} ❌")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if failed == 0:
            print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        else:
            print(f"\n⚠️  {failed} test(s) failed. Please check the details above.")
        
        return passed, total

if __name__ == "__main__":
    tester = SvenskPa3APITester()
    passed, total = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if passed == total else 1)