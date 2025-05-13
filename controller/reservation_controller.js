import reservationService from "../services/reservation_service.js";

class ReservationController {
  createReservation = async (req, res) => {
    console.log("Request Body:", req.body);
    try {
      const {
        reservationTime,
        reservationDate,
        numberOfPersons,
        tableNumber,
        restaurantId,
        deal,
        additionalNotes,
        userId,
      } = req.body;

      const reservation = await reservationService.createReservation({
        reservationTime,
        reservationDate,
        numberOfPersons,
        tableNumber,
        restaurantId,
        deal,
        additionalNotes,
        userId,
      });

      return res.status(201).json({
        success: true,
        message: "Reservation created successfully.",
        reservation,
      });
    } catch (error) {
      console.error("Error creating reservation:", error.message);

      const statusCode = error.statusCode || 400;

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to create reservation.",
      });
    }
  };

  createPaymentIntent = async (req, res) => {
    try {
      const { amount, reservationId } = req.body;
      const paymentIntent = await reservationService.createPaymentIntent(
        amount,
        reservationId
      );

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create payment intent",
      });
    }
  };

  getAllReservations = async (req, res) => {
    try {
      const reservations = await reservationService.getAllReservations();

      return res.status(200).json({
        success: true,
        message: "All reservations fetched successfully.",
        reservations,
      });
    } catch (error) {
      console.error("Error fetching reservations:", error.message);

      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to fetch reservations.",
      });
    }
  };

  fetchReservation = async (req, res) => {
    try {
      const getPastReservations =
        await reservationService.getPastReservations();
      const upcomingReservations =
        await reservationService.upcomingReservations();

      res.status(200).json({
        past: getPastReservations,
        upcoming: upcomingReservations,
      });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  };
  extendReservation = async (req, res) => {
    try {
      const {
        reservationId,
        newReservationTime,
        newReservationDate,
        numberOfPersons,
      } = req.body;

      // Validate required fields
      if (
        !reservationId ||
        !newReservationTime ||
        !newReservationDate ||
        !numberOfPersons
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Reservation ID, new time, new date, and number of persons are required.",
        });
      }

      const updatedReservation = await reservationService.extendReservation({
        reservationId,
        newReservationTime,
        newReservationDate,
        numberOfPersons,
      });

      return res.status(200).json({
        success: true,
        message: "Reservation extended successfully.",
        reservation: updatedReservation,
      });
    } catch (error) {
      console.error("Error extending reservation:", error.message);
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to extend reservation.",
      });
    }
  };

  getReservationsByUserId = async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required.",
        });
      }

      const categorizedReservations =
        await reservationService.getReservationsByUserId(userId);

      return res.status(200).json({
        success: true,
        message: "Reservations fetched successfully.",
        reservations: categorizedReservations,
      });
    } catch (error) {
      console.error("Error fetching reservations:", error.message);
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to fetch reservations.",
      });
    }
  };

  cancelReservation = async (req, res) => {
    try {
      const { reservationId, userId } = req.body;
      if (!reservationId || !userId) {
        return res.status(400).json({
          success: false,
          message: "reservationId and userId are required.",
        });
      }
      const result = await reservationService.cancelReservation(reservationId, userId);
      return res.status(200).json({
        success: true,
        message: "Reservation cancelled successfully.",
        reservation: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to cancel reservation.",
      });
    }
  };
}

export default new ReservationController();
