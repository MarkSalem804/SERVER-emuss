const express = require("express");
const userRouter = express.Router();
const userService = require("./user-services");
const { validateRegistration } = require("../Middlewares/validation");

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.authenticateUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.post("/register", validateRegistration, async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const result = await userService.updateUser(id, updateData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

userRouter.get("/getAllUsers", async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = userRouter;
