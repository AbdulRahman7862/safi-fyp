import express from "express"
import ReservationController from "../controller/reservation_controller.js"

const router = express.Router()

router.post("/create", ReservationController.createReservation)
router.get("/get", ReservationController.getAllReservations)
router.patch("/extend", ReservationController.extendReservation)
// router.get("/:reservationId", ReservationController.getReservationById);
router.get("/user/:userId", ReservationController.getReservationsByUserId);

export default router

