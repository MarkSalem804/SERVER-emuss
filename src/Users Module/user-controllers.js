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

module.exports = userRouter;
