import express from 'express';
import paymentController from '../controller/payment_controller.js';

const router = express.Router();

router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/process', paymentController.processPayment);
router.get('/status/:reservationId', paymentController.getPaymentStatus);

export default router; 