import express from 'express';
import getBookingStats from "../controller/booking_controller.js";

const router = express.Router();

// Route to get the booking stats
router.get('/stats', getBookingStats);

export default router;
