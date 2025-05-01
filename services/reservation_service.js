import dotenv from 'dotenv'
import { Op } from "sequelize"
import Stripe from 'stripe'
import Reservation from "../model/reservation_model.js"
import Restaurant from "../model/restaurant_model.js"
import User from "../model/user_model.js"

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const fetchLatestRestaurant = async () => {
  const latestRestaurant = await Restaurant.findOne({
    order: [["createdAt", "DESC"]],
  })
  if (!latestRestaurant) {
    throw new Error("No restaurants available for reservation.")
  }
  return latestRestaurant
}

const createReservation = async (data) => {
  const {
    reservationTime,
    reservationDate,
    numberOfPersons,
    tableNumber,
    restaurantId,
    deal,
    additionalNotes,
    userId,
  } = data

  let selectedRestaurantId = restaurantId
  if (!restaurantId) {
    const latestRestaurant = await fetchLatestRestaurant()
    selectedRestaurantId = latestRestaurant.id
  }
  const normalizedDate = new Date(reservationDate).toISOString().split("T")[0]  
  const normalizedTime = reservationTime.trim()  

  const existingReservation = await Reservation.findOne({
    where: {
      restaurantId: selectedRestaurantId,
      tableNumber,
      reservationDate: {
        [Op.eq]: new Date(normalizedDate),  
      },
      reservationTime: normalizedTime,
    },
  })

  if (existingReservation) {
    console.log("Conflict found:", {
      existingReservation: {
        id: existingReservation.id,
        restaurantId: existingReservation.restaurantId,
        tableNumber: existingReservation.tableNumber,
        reservationDate: existingReservation.reservationDate,
        reservationTime: existingReservation.reservationTime,
      },
    })
    throw new Error(
      `Table ${tableNumber} is already reserved at ${reservationTime} on ${reservationDate}.`
    )
  } else {
    console.log("No conflict found, proceeding with reservation.")
  }

  const reservation = await Reservation.create({
    reservationTime: normalizedTime,
    reservationDate: new Date(normalizedDate),  
    numberOfPersons,
    tableNumber,
    reservationStatus: "Pending",
    restaurantId: selectedRestaurantId,
    deal: deal || null,
    additionalNotes: additionalNotes || null,
    userId,
  })

  return reservation
}

const createPaymentIntent = async (amount, reservationId) => {
  try {
    // First, get the reservation to verify it exists
    const reservation = await Reservation.findByPk(reservationId)
    if (!reservation) {
      throw new Error('Reservation not found')
    }

    // Create a payment intent with the provided price ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: { 
        reservationId: reservationId,
        priceId: 'price_1RI3LbRon0O2j9QfjJrHzABZ',
        productId: 'prod_SCSGI95V3cvoYv'
      },
      description: `Payment for reservation ${reservationId}`,
    })

    // Update reservation status to 'Processing'
    await Reservation.update(
      { reservationStatus: 'Processing' },
      { where: { id: reservationId } }
    )

    return paymentIntent
  } catch (error) {
    // If payment intent creation fails, update reservation status to 'Failed'
    if (reservationId) {
      await Reservation.update(
        { reservationStatus: 'Failed' },
        { where: { id: reservationId } }
      )
    }
    throw new Error(`Failed to create payment intent: ${error.message}`)
  }
}

const updateReservationStatus = async (reservationId, status) => {
  const reservation = await Reservation.findByPk(reservationId)
  if (!reservation) {
    throw new Error('Reservation not found')
  }
  reservation.reservationStatus = status
  await reservation.save()
  return reservation
}

const getAllReservations = async () => {
  const reservations = await Reservation.findAll({
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
  return reservations
}

const getPastReservations = async () => {
  const today = new Date()
  return await Reservation.findAll({
    where: { reservationDate: { [Op.lt]: today } },
    order: [["reservationDate", "DESC"]],
  })
}

const upcomingReservations = async () => {
  const today = new Date()
  return await Reservation.findAll({
    where: { reservationDate: { [Op.gte]: today } },
    order: [["reservationDate", "ASC"]],
  })
}

export default {
  createReservation,
  createPaymentIntent,
  updateReservationStatus,
  getAllReservations,
  getPastReservations,
  upcomingReservations,
}
