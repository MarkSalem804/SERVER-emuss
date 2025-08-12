const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function findUserByEmail(email) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw new Error("Error finding user: " + error.message);
  }
}

async function findUserById(id) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return user;
  } catch (error) {
    throw new Error("Error finding user by ID: " + error.message);
  }
}

async function createUser(userData) {
  try {
    const {
      email,
      password,
      schoolId,
      officeId,
      role,
      designation,
      positionId,
    } = userData;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        schoolId: schoolId ? parseInt(schoolId) : null,
        officeId: officeId ? parseInt(officeId) : null,
        role: role || null,
        designation: designation || null,
        positionId: positionId ? parseInt(positionId) : null,
      },
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
}

async function updateLastLogin(id) {
  try {
    await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    throw new Error("Error updating last login: " + error.message);
  }
}

async function deleteUser(id) {
  try {
    // Check if user exists before deleting
    const existingUser = await findUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Delete the user
    await prisma.users.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
}

async function updateUser(id, updateData) {
  try {
    // Check if user exists before updating
    const existingUser = await findUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // Prepare update data
    const updateFields = {};
    
    // Only update fields that are provided
    if (updateData.email !== undefined) {
      // Check if new email already exists for another user
      if (updateData.email !== existingUser.email) {
        const userWithEmail = await findUserByEmail(updateData.email);
        if (userWithEmail && userWithEmail.id !== parseInt(id)) {
          throw new Error("Email already exists for another user");
        }
      }
      updateFields.email = updateData.email;
    }

    if (updateData.password !== undefined) {
      // Hash the new password
      const saltRounds = 12;
      updateFields.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    if (updateData.schoolId !== undefined) {
      updateFields.schoolId = updateData.schoolId ? parseInt(updateData.schoolId) : null;
    }

    if (updateData.officeId !== undefined) {
      updateFields.officeId = updateData.officeId ? parseInt(updateData.officeId) : null;
    }

    if (updateData.role !== undefined) {
      updateFields.role = updateData.role;
    }

    if (updateData.designation !== undefined) {
      updateFields.designation = updateData.designation;
    }

    if (updateData.positionId !== undefined) {
      updateFields.positionId = updateData.positionId ? parseInt(updateData.positionId) : null;
    }

    // If no fields to update, return early
    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields to update");
    }

    // Update the user
    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: updateFields,
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLogin,
  deleteUser,
  updateUser,
};
