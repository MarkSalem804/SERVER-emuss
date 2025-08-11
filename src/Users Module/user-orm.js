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

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLogin,
};
