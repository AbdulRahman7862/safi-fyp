// routes/filterReservation.router.js
import express from 'express';
import filterReservationController from '../controller/filter_reservation_controller.js';

const router = express.Router();

router.post('/filter-reservations', filterReservationController.filterReservations);

export default router;
