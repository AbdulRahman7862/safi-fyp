import dotenv from 'dotenv';
import Stripe from 'stripe';
import Reservation from '../model/reservation_model.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  
  createPaymentIntent = async (req, res) => {
    try {
      const { reservationId } = req.body;

      // Validate input
      if (!reservationId) {
        return res.status(400).json({
          success: false,
          message: 'Reservation ID is required'
        });
      }

      // Check if reservation exists
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation not found'
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // $10.00 in cents
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        metadata: {
          reservationId: reservationId,
          productId: 'prod_SCSGI95V3cvoYv'
        },
        description: `Payment for reservation ${reservationId}`
      });

      // Update reservation status to Processing
      await Reservation.update(
        { reservationStatus: 'Processing' },
        { where: { id: reservationId } }
      );

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create payment intent'
      });
    }
  };

  // Process payment with card details
  processPayment = async (req, res) => {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;

      // Validate input
      if (!paymentIntentId || !paymentMethodId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID and payment method ID are required'
        });
      }

      // Confirm the payment intent with the payment method
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });

      // Check payment status
      if (paymentIntent.status === 'succeeded') {
        // Update reservation status to Accepted
        await Reservation.update(
          { reservationStatus: 'Accepted' },
          { where: { id: paymentIntent.metadata.reservationId } }
        );

        return res.status(200).json({
          success: true,
          message: 'Payment successful',
          status: 'Accepted'
        });
      } else {
        // Update reservation status to Failed
        await Reservation.update(
          { reservationStatus: 'Failed' },
          { where: { id: paymentIntent.metadata.reservationId } }
        );

        return res.status(400).json({
          success: false,
          message: 'Payment failed',
          status: 'Failed'
        });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Update reservation status to Failed if there's an error
      if (req.body.paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(req.body.paymentIntentId);
        if (paymentIntent.metadata.reservationId) {
          await Reservation.update(
            { reservationStatus: 'Failed' },
            { where: { id: paymentIntent.metadata.reservationId } }
          );
        }
      }

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to process payment',
        status: 'Failed'
      });
    }
  };

  // Get payment status
  getPaymentStatus = async (req, res) => {
    try {
      const { reservationId } = req.params;
      
      const reservation = await Reservation.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation not found'
        });
      }

      return res.status(200).json({
        success: true,
        status: reservation.reservationStatus
      });
    } catch (error) {
      console.error('Error getting payment status:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payment status'
      });
    }
  };

  // Get payment intent details
  getPaymentIntent = async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return res.status(200).json({
        success: true,
        paymentIntent
      });
    } catch (error) {
      console.error('Error getting payment intent:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payment intent'
      });
    }
  };

  // Cancel payment intent
  cancelPaymentIntent = async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      
      // Update reservation status to Failed
      if (paymentIntent.metadata.reservationId) {
        await Reservation.update(
          { reservationStatus: 'Failed' },
          { where: { id: paymentIntent.metadata.reservationId } }
        );
      }

      return res.status(200).json({
        success: true,
        message: 'Payment intent cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling payment intent:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to cancel payment intent'
      });
    }
  };
}

export default new PaymentController(); 