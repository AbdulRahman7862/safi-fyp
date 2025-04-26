import Reservation from '../model/reservation_model.js'; // Import the Reservation model

class BookingService {
  // Helper function to get the start of a specific interval (24 hours, 7 days, 30 days, 365 days)
  static getStartOfInterval(days) {
    const now = new Date();
    now.setDate(now.getDate() - days); // Subtract the number of days from current date
    return now;
  }

  // Function to get booking statistics
  static async getStats() {
    const now = new Date();

    // Fetch all reservations from the database
    const reservations = await Reservation.findAll();

    let total = 0;
    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let yearly = 0;

    // Get the start of the intervals
    const startOfDay = this.getStartOfInterval(1);  // 24 hours ago
    const startOfWeek = this.getStartOfInterval(7); // 7 days ago
    const startOfMonth = this.getStartOfInterval(30); // 30 days ago
    const startOfYear = this.getStartOfInterval(365); // 365 days ago

    // Loop through each reservation and update the counts
    for (const res of reservations) {
      const resDate = new Date(res.reservationDate);  // Convert reservationDate to Date object

      // Count total reservations
      total++;

      // Check if the reservation falls within the daily, weekly, monthly, or yearly range
      if (resDate >= startOfDay) daily++;
      if (resDate >= startOfWeek) weekly++;
      if (resDate >= startOfMonth) monthly++;
      if (resDate >= startOfYear) yearly++;
    }

    // Return the stats
    return { total, daily, weekly, monthly, yearly };
  }
}

export default BookingService;
