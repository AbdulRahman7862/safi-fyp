// controller/booking_controller.js
import BookingService from '../services/booking_service.js';

const getBookingStats = async (req, res) => {
  try {
    // Get the stats from the BookingService
    const stats = await BookingService.getStats();

    // Send the stats as a response
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({ message: "Error fetching booking stats", error: error.message });
  }
};

export default getBookingStats;
