// Test file for user registration API
// Run this with: node test-registration.js

const axios = require("axios");

const API_BASE_URL = "http://localhost:5016/api";

async function testUserRegistration() {
  try {
    console.log("🧪 Testing User Registration API...\n");

    // Test 1: Valid user registration
    console.log("✅ Test 1: Valid user registration");
    const validUser = {
      email: "test@example.com",
      password: "password123",
      role: "teacher",
      designation: "SDO - Imus City",
      schoolId: 1,
    };

    const response1 = await axios.post(
      `${API_BASE_URL}/users/register`,
      validUser
    );
    console.log("Response:", response1.data);
    console.log("Status:", response1.status);
    console.log("");

    // Test 2: Duplicate email (should fail)
    console.log("❌ Test 2: Duplicate email registration (should fail)");
    try {
      const response2 = await axios.post(
        `${API_BASE_URL}/users/register`,
        validUser
      );
      console.log("Unexpected success:", response2.data);
    } catch (error) {
      console.log("Expected error:", error.response.data);
    }
    console.log("");

    // Test 3: Invalid email format (should fail)
    console.log("❌ Test 3: Invalid email format (should fail)");
    try {
      const invalidEmailUser = {
        email: "invalid-email",
        password: "password123",
      };
      const response3 = await axios.post(
        `${API_BASE_URL}/users/register`,
        invalidEmailUser
      );
      console.log("Unexpected success:", response3.data);
    } catch (error) {
      console.log("Expected error:", error.response.data);
    }
    console.log("");

    // Test 4: Weak password (should fail)
    console.log("❌ Test 4: Weak password (should fail)");
    try {
      const weakPasswordUser = {
        email: "test2@example.com",
        password: "123",
      };
      const response4 = await axios.post(
        `${API_BASE_URL}/users/register`,
        weakPasswordUser
      );
      console.log("Unexpected success:", response4.data);
    } catch (error) {
      console.log("Expected error:", error.response.data);
    }
    console.log("");

    // Test 5: Missing required fields (should fail)
    console.log("❌ Test 5: Missing required fields (should fail)");
    try {
      const incompleteUser = {
        email: "test3@example.com",
        // missing password
      };
      const response5 = await axios.post(
        `${API_BASE_URL}/users/register`,
        incompleteUser
      );
      console.log("Unexpected success:", response5.data);
    } catch (error) {
      console.log("Expected error:", error.response.data);
    }

    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testUserRegistration();
}

module.exports = { testUserRegistration };
