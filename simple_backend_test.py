#!/usr/bin/env python3
"""
Simple Backend API Verification for SvenskPå3 Swedish Learning App
Verifies all endpoints are working correctly
"""

import requests
import json
import time
import os

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
API_BASE = f"{BASE_URL}/api"

def test_api_endpoints():
    """Test all API endpoints with simple verification"""
    print("🚀 SvenskPå3 Backend API Verification")
    print("=" * 50)
    print(f"API Base: {API_BASE}")
    print()
    
    session = requests.Session()
    test_email = f"verify_{int(time.time())}@example.com"
    test_password = "VerifyPass123!"
    
    results = []
    
    # Test 1: Signup
    print("1️⃣ Testing Signup...")
    try:
        response = session.post(f"{API_BASE}/auth/signup", json={
            "email": test_email,
            "password": test_password,
            "displayName": "Verify User"
        })
        data = response.json()
        success = response.status_code == 200 and data.get('success') and data.get('user')
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Signup API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Signup API", False))
    
    # Test 2: Signin
    print("2️⃣ Testing Signin...")
    try:
        response = session.post(f"{API_BASE}/auth/signin", json={
            "email": test_email,
            "password": test_password
        })
        data = response.json()
        success = response.status_code == 200 and data.get('success')
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Signin API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Signin API", False))
    
    # Test 3: Get Me
    print("3️⃣ Testing Get Me...")
    try:
        response = session.get(f"{API_BASE}/auth/me")
        data = response.json()
        success = response.status_code == 200 and data.get('email') == test_email
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Get Me API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Get Me API", False))
    
    # Test 4: Get Profile
    print("4️⃣ Testing Get Profile...")
    try:
        response = session.get(f"{API_BASE}/profile")
        data = response.json()
        success = response.status_code == 200 and 'displayName' in data
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Get Profile API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Get Profile API", False))
    
    # Test 5: Update Profile
    print("5️⃣ Testing Update Profile...")
    try:
        response = session.put(f"{API_BASE}/profile", json={
            "displayName": "Updated Name",
            "level": "intermediate"
        })
        data = response.json()
        success = response.status_code == 200 and data.get('success')
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Update Profile API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Update Profile API", False))
    
    # Test 6: Get Progress
    print("6️⃣ Testing Get Progress...")
    try:
        response = session.get(f"{API_BASE}/progress")
        data = response.json()
        success = response.status_code == 200 and 'progress' in data and 'currentStreak' in data
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Get Progress API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Get Progress API", False))
    
    # Test 7: Complete Lesson
    print("7️⃣ Testing Complete Lesson...")
    try:
        response = session.post(f"{API_BASE}/progress", json={
            "xpEarned": 20
        })
        data = response.json()
        success = response.status_code == 200 and data.get('success')
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Complete Lesson API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Complete Lesson API", False))
    
    # Test 8: Contact Form
    print("8️⃣ Testing Contact Form...")
    try:
        response = session.post(f"{API_BASE}/contact", json={
            "email": "test@example.com",
            "message": "Test message"
        })
        data = response.json()
        success = response.status_code == 200 and data.get('success')
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Contact Form API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Contact Form API", False))
    
    # Test 9: Logout
    print("9️⃣ Testing Logout...")
    try:
        response = session.post(f"{API_BASE}/auth/logout")
        data = response.json()
        success = response.status_code == 200 and data.get('success')
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Logout API", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Logout API", False))
    
    # Test 10: Error Handling - Duplicate Email
    print("🔟 Testing Error Handling - Duplicate Email...")
    try:
        response = session.post(f"{API_BASE}/auth/signup", json={
            "email": test_email,  # Same email
            "password": "AnotherPass123!"
        })
        data = response.json()
        success = response.status_code == 400 and 'allerede registrert' in data.get('error', '').lower()
        print(f"   Status: {response.status_code}, Success: {success}")
        results.append(("Error Handling", success))
    except Exception as e:
        print(f"   Error: {e}")
        results.append(("Error Handling", False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅" if success else "❌"
        print(f"{status} {test_name}")
    
    print(f"\nTotal: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\n🎉 ALL APIS WORKING CORRECTLY!")
    else:
        print(f"\n⚠️ {total - passed} API(s) have issues")
    
    return passed, total

if __name__ == "__main__":
    passed, total = test_api_endpoints()
    exit(0 if passed == total else 1)