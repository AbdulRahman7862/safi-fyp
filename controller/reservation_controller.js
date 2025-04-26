// import reservationService from "../services/reservation_service.js"

// class ReservationController {
//   createReservation = async (req, res) => {
//     console.log("Request Body:", req.body)
//     try {
//       const {
//         reservationTime,
//         reservationDate,
//         numberOfPersons,
//         tableNumber, 
//         restaurantId,
//         deal,
//         additionalNotes,
//         userId,
//       } = req.body

//       const reservation = await reservationService.createReservation({
//         reservationTime,
//         reservationDate,
//         numberOfPersons,
//         tableNumber, 
//         restaurantId,
//         deal,
//         additionalNotes,
//         userId,
//       })

//       return res.status(201).json({
//         success: true,
//         message: "Reservation created successfully.",
//         reservation,
//       })
//     } catch (error) {
//       console.error("Error creating reservation:", error.message)

//       const statusCode = error.statusCode || 400

//       return res.status(statusCode).json({
//         success: false,
//         message: error.message || "Failed to create reservation.",
//       })
//     }
//   }

//   getAllReservations = async (req, res) => {
//     try {
//       const reservations = await reservationService.getAllReservations()

//       return res.status(200).json({
//         success: true,
//         message: "All reservations fetched successfully.",
//         reservations,
//       })
//     } catch (error) {
//       console.error("Error fetching reservations:", error.message)

//       const statusCode = error.statusCode || 500

//       return res.status(statusCode).json({
//         success: false,
//         message: error.message || "Failed to fetch reservations.",
//       })
//     }
//   }
//   fetchReservation = async(req, res) =>{
//     try {
//       const  getPastReservations = await getPastReservations();
//       const upcomingReservations = await upcomingReservations();

//       res.status(200).json({
//         past: getPastReservations,
//         upcoming: upcomingReservations,
//       });
//     } catch (error) {
//       console.error("Error fetching reservations:", error);
//     res.status(500).json({ message: "Failed to fetch reservations" });
//     }
//   }
// }


// export default new ReservationController()
import reservationService from "../services/reservation_service.js"

class ReservationController {
  createReservation = async (req, res) => {
    console.log("Request Body:", req.body)
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
      } = req.body

      const reservation = await reservationService.createReservation({
        reservationTime,
        reservationDate,
        numberOfPersons,
        tableNumber, 
        restaurantId,
        deal,
        additionalNotes,
        userId,
      })

      return res.status(201).json({
        success: true,
        message: "Reservation created successfully.",
        reservation,
      })
    } catch (error) {
      console.error("Error creating reservation:", error.message)

      const statusCode = error.statusCode || 400

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to create reservation.",
      })
    }
  }

  createPaymentIntent = async (req, res) => {
    try {
      const { amount, reservationId } = req.body
      const paymentIntent = await reservationService.createPaymentIntent(amount, reservationId)
      
      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      })
    } catch (error) {
      console.error("Error creating payment intent:", error.message)
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create payment intent",
      })
    }
  }

  getAllReservations = async (req, res) => {
    try {
      const reservations = await reservationService.getAllReservations()

      return res.status(200).json({
        success: true,
        message: "All reservations fetched successfully.",
        reservations,
      })
    } catch (error) {
      console.error("Error fetching reservations:", error.message)

      const statusCode = error.statusCode || 500

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to fetch reservations.",
      })
    }
  }

  fetchReservation = async(req, res) =>{
    try {
      const getPastReservations = await reservationService.getPastReservations()
      const upcomingReservations = await reservationService.upcomingReservations()

      res.status(200).json({
        past: getPastReservations,
        upcoming: upcomingReservations,
      })
    } catch (error) {
      console.error("Error fetching reservations:", error)
      res.status(500).json({ message: "Failed to fetch reservations" })
    }
  }
}

export default new ReservationController()