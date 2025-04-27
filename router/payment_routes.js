import express from 'express';
import paymentController from '../controller/payment_controller.js';

const router = express.Router();

// Create payment intent
router.post('/create-intent', paymentController.createPaymentIntent);

// Process payment with card details
router.post('/process', paymentController.processPayment);

// Get payment status
router.get('/status/:reservationId', paymentController.getPaymentStatus);

export default router; 