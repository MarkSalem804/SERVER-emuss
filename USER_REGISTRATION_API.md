# User Registration API Documentation

## Overview

The User Registration API allows new users to create accounts in the EMUSS system. This API includes comprehensive validation, secure password hashing, and proper error handling.

## Endpoint

```
POST /api/users/register
```

## Request Headers

```
Content-Type: application/json
```

## Request Body

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "teacher",
  "designation": "SDO - Imus City",
  "schoolId": 1,
  "officeId": 2,
  "positionId": 3
}
```

### Field Descriptions

- **email** (required): User's email address - must be unique and valid format
- **password** (required): User's password - minimum 6 characters
- **role** (optional): User's role in the system
- **designation** (optional): User's designation (e.g., "SDO - Imus City", "School Imus City")
- **schoolId** (optional): ID of the school the user belongs to
- **officeId** (optional): ID of the office the user belongs to
- **positionId** (optional): ID of the user's position

## Response

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "teacher",
    "designation": "SDO - Imus City",
    "schoolId": 1,
    "officeId": null,
    "positionId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Validation Errors

```json
{
  "success": false,
  "error": "Email and password are required"
}
```

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

```json
{
  "success": false,
  "error": "Password must be at least 6 characters long"
}
```

#### 400 Bad Request - Business Logic Errors

```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

## Validation Rules

### Email

- Required field
- Must be a valid email format (e.g., user@domain.com)
- Must be unique in the system

### Password

- Required field
- Minimum length: 6 characters
- Will be automatically hashed using bcrypt with 12 salt rounds

### Optional Fields

- **schoolId**: Must be a valid integer if provided
- **officeId**: Must be a valid integer if provided
- **positionId**: Must be a valid integer if provided

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **Input Validation**: Comprehensive validation of all input fields
3. **Duplicate Prevention**: Prevents registration with existing email addresses
4. **Data Sanitization**: Numeric fields are properly parsed and validated

## Example Usage

### cURL

```bash
curl -X POST http://localhost:5016/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.edu",
    "password": "mypassword123",
    "role": "teacher",
    "designation": "School Imus City",
    "schoolId": 1
  }'
```

### JavaScript (Node.js)

```javascript
const axios = require("axios");

const registerUser = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5016/api/users/register",
      {
        email: "teacher@school.edu",
        password: "mypassword123",
        role: "teacher",
        designation: "School Imus City",
        schoolId: 1,
      }
    );

    console.log("User registered:", response.data);
  } catch (error) {
    console.error("Registration failed:", error.response.data);
  }
};

registerUser();
```

### JavaScript (Frontend)

```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5016/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Registration successful:", result);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
};

// Usage
registerUser({
  email: "teacher@school.edu",
  password: "mypassword123",
  role: "teacher",
});
```

## Testing

A test file `test-registration.js` is included to test the API functionality. To run the tests:

1. Make sure the server is running
2. Install axios: `npm install axios`
3. Run: `node test-registration.js`

## Error Handling

The API provides detailed error messages for various scenarios:

- Missing required fields
- Invalid email format
- Weak passwords
- Duplicate email addresses
- Invalid numeric field values

## Database Schema

The user registration creates records in the `users` table with the following structure:

- `id`: Auto-incrementing primary key
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (optional)
- `designation`: User designation (optional)
- `schoolId`: Foreign key to schools table (optional)
- `officeId`: Foreign key to offices table (optional)
- `positionId`: Foreign key to positions table (optional)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

## Related Endpoints

- `POST /api/users/login` - User authentication
- `GET /api/health` - Server health check
- `GET /` - API documentation and available endpoints
