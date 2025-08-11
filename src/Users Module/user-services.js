const bcrypt = require("bcryptjs");
const userORM = require("./user-orm");

async function authenticateUser(email, password) {
  try {
    // First, find the user by email
    const user = await userORM.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // Then compare the provided password with the hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Return user data without password for security
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error authenticating user: " + error.message);
  }
}

async function registerUser(userData) {
  try {
    // Validate required fields
    const { email, password } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create user through ORM
    const newUser = await userORM.createUser(userData);

    return {
      success: true,
      message: "User registered successfully",
      user: newUser,
    };
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
}

module.exports = {
  authenticateUser,
  registerUser,
};
