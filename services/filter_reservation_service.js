import { Op } from 'sequelize';
import Reservation from '../model/reservation_model.js';
import User from '../model/user_model.js';

const getFilteredReservations = async (filters) => {
  try {
    const { username, date, deal, tableNumber, dealName } = filters;
    
    const whereClause = {};
    const include = [{
      model: User,
      as: 'User',
      attributes: ['username'],
      required: false
    }];

    if (username) {
      include[0].required = true;
      include[0].where = { 
        username: { [Op.like]: `%${username}%` } 
      };
    }

    if (date) {
      whereClause.reservationDate = date;
    }

    if (deal && deal !== 'All') {
      whereClause.deal = deal;
    }

    if (tableNumber && tableNumber !== 'any') {
      whereClause.tableNumber = tableNumber;
    }

    if (dealName && dealName !== 'All') {
      whereClause.deal = { [Op.like]: `%${dealName}%` };
    }

    const reservations = await Reservation.findAll({
      where: whereClause,
      include: include,
      order: [['reservationDate', 'ASC'], ['reservationTime', 'ASC']],
      raw: true,
      nest: true // This helps with nested includes
    });

    return reservations.map(res => ({
      ...res,
      
    }));

  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export default { getFilteredReservations };