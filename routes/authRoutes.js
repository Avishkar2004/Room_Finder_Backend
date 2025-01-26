import express from "express";
import {
  signup,
  login,
  getMe,
  checkAvailability,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/check-availability", checkAvailability);
router.get("/me", verifyToken, getMe);

// Password reset with otp

router.post("/forgot-password", requestPasswordReset); // Request OTP
router.post("/reset-password", resetPassword); // Reset password using OTP

export default router;
