import express from "express";
import { resetPassword, sendResetOtp, verifyResetOtp } from "../controller/auth/reset_password.js";

const router = express.Router();

router.post("/send-reset-otp", sendResetOtp)
.post("/verify-reset-otp", verifyResetOtp)
.post("/reset-password", resetPassword)

export default router;