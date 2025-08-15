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

async function deleteUser(userId) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Check if userId is a valid number
    if (isNaN(parseInt(userId))) {
      throw new Error("Invalid user ID format");
    }

    // Delete user through ORM
    const result = await userORM.deleteUser(userId);

    return {
      success: true,
      message: result.message,
      userId: parseInt(userId),
    };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
}

async function updateUser(userId, updateData) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Check if userId is a valid number
    if (isNaN(parseInt(userId))) {
      throw new Error("Invalid user ID format");
    }

    // Validate updateData
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Update data is required and must be an object");
    }

    // Validate that at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    // Validate email format if email is being updated
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw new Error("Invalid email format");
      }
    }

    // Validate password strength if password is being updated
    if (updateData.password) {
      if (updateData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
    }

    // Update user through ORM
    const updatedUser = await userORM.updateUser(userId, updateData);

    return {
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    };
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
}

async function getAllUsers() {
  try {
    const users = await userORM.getAllUsers();
    return {
      success: true,
      message: "Users fetched successfully",
      users: users,
    };
  } catch (error) {
    throw new Error("Error getting all users: " + error.message);
  }
}

module.exports = {
  authenticateUser,
  registerUser,
  deleteUser,
  updateUser,
  getAllUsers,
};
