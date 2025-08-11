const express = require("express");
const userRouter = require("../Users Module/user-controllers");

const Routes = (app) => {
  const router = express.Router();

  // API Routes
  router.use("/users", userRouter);

  // Health check endpoint
  router.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  // Mount all routes under /api prefix
  app.use("/api", router);

  // Root endpoint
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "EMUSS API Server",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        users: {
          login: "/api/users/login",
          register: "/api/users/register",
        },
      },
      timestamp: new Date().toISOString(),
    });
  });
};

module.exports = Routes;
