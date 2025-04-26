// controllers/filterReservation.controller.js
import filterReservationService from '../services/filter_reservation_service.js';

const filterReservations = async (req, res) => {
  try {
    const filters = req.body;
    
    if (!filters || Object.keys(filters).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one filter parameter'
      });
    }

    const reservations = await filterReservationService.getFilteredReservations(filters);
    
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
    
  } catch (error) {
    console.error('Filter Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process your request',
      error: error.message
    });
  }
};

export default { filterReservations };
