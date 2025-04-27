import express from 'express';
import { resetPassword, sendResetOTP, verifyOTP } from '../controller/password_reset_controller.js';

const router = express.Router();

router.post('/send-otp', sendResetOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;
