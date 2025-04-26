import express from "express"
import ReservationController from "../controller/reservation_controller.js"

const router = express.Router()

router.post("/create", ReservationController.createReservation)
router.get("/get", ReservationController.getAllReservations)

export default router
