import cors from "cors"
import express from "express"
import morgan from "morgan"
import { connectDB, sequelize } from "./config/db.js"
import areaRoutes from "./router/area_router.js"
import bookingRoutes from "./router/booking_router.js"
import categoryRoutes from "./router/category_routes.js"
import dealRoutes from "./router/deal_router.js"
import favoriteRoutes from "./router/favorite_restaurant_router.js"
import filterReservation from "./router/filter_reservation_router.js"
import filterRoutes from "./router/filter_restaurant.js"
import reservationRoutes from "./router/reservation_routes.js"
import resetRoutes from "./router/reset_password.js"
import restaurantRoutes from "./router/restaurant_routes.js"
import roleRoutes from "./router/role_routes.js"
import userRoutes from "./router/user_routes.js"
import dotenv from "dotenv"
import Stripe from "stripe"
import Reservation from "./model/reservation_model.js"
import paymentRoutes from "./router/payment_routes.js"

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))

connectDB()
app.use("/api/filter-restaurant", filterReservation)
app.use("/api/bookings", bookingRoutes)
app.use("/api/filter", filterRoutes)
app.use("/api/users", userRoutes)
app.use("/api/roles", roleRoutes)
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/reservation", reservationRoutes)
app.use("/api/deals", dealRoutes)
app.use("/api/reset", resetRoutes)
app.use("/api/filters", filterRoutes)
app.use("/api/areas", areaRoutes);
app.use("/api/favorites", favoriteRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/payments", paymentRoutes)

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event = null
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET)
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(`PaymentIntent was successful!`, paymentIntent)
        
        // Get the reservation ID from the payment intent metadata
        const reservationId = paymentIntent.metadata.reservationId
        
        if (reservationId) {
          try {
            // Update the reservation status to "Accepted"
            await Reservation.update(
              { reservationStatus: "Accepted" },
              { where: { id: reservationId } }
            )
            console.log(`Reservation ${reservationId} status updated to Accepted`)
          } catch (error) {
            console.error(`Error updating reservation status: ${error.message}`)
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log(`PaymentIntent failed!`, failedPayment)
        
        // Get the reservation ID from the failed payment metadata
        const failedReservationId = failedPayment.metadata.reservationId
        
        if (failedReservationId) {
          try {
            // Update the reservation status to "Failed"
            await Reservation.update(
              { reservationStatus: "Failed" },
              { where: { id: failedReservationId } }
            )
            console.log(`Reservation ${failedReservationId} status updated to Failed`)
          } catch (error) {
            console.error(`Error updating failed reservation status: ${error.message}`)
          }
        }
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object
        console.log(`PaymentIntent canceled!`, canceledPayment)
        
        // Get the reservation ID from the canceled payment metadata
        const canceledReservationId = canceledPayment.metadata.reservationId
        
        if (canceledReservationId) {
          try {
            // Update the reservation status to "Failed"
            await Reservation.update(
              { reservationStatus: "Failed" },
              { where: { id: canceledReservationId } }
            )
            console.log(`Reservation ${canceledReservationId} status updated to Failed`)
          } catch (error) {
            console.error(`Error updating canceled reservation status: ${error.message}`)
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    res.sendStatus(200)
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    res.status(400).send(`Webhook Error: ${err.message}`)
  }
});

  
import Area from "./model/area_model.js"
import DealsCategory from "./model/deal_category_model.js"
import DealMenuItem from "./model/deal_menu_items.js"
import Deals from "./model/deals.js"
// import ReservationDeals from "./model/reservation_deal.js"
import {
  default as Restaurant
} from "./model/reservation_model.js"
import Role from "./model/role_model.js"
import SeatingTable from "./model/seating_table.js"
import User from "./model/user_model.js"

User.belongsTo(Role, { foreignKey: "roleId" })
User.hasOne(Restaurant, { foreignKey: "userId" })
Restaurant.belongsTo(User, { foreignKey: "userId" })

Restaurant.hasMany(Deals, { foreignKey: "restaurant_id", as: "deals" });
Deals.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

// Reservation.belongsTo(User, { foreignKey: "userId" })
// Reservation.belongsTo(Restaurant, { foreignKey: "restaurantId" })
// Reservation.belongsTo(ReservationTable, { foreignKey: "reservationTableId" })
Area.belongsTo(Restaurant, { foreignKey: "restaurantId" })
Deals.belongsTo(DealsCategory, { foreignKey: "dealCategoryId" })
SeatingTable.belongsTo(Area, { foreignKey: "areaId" })
Deals.belongsTo(DealsCategory, { foreignKey: "dealCategoryId" })
DealsCategory.hasMany(Deals, { foreignKey: "dealCategoryId" })
DealMenuItem.belongsTo(Deals, { foreignKey: "dealId" })
Deals.belongsTo(DealsCategory, { foreignKey: "categoryId", as: "category" })
Deals.belongsTo(Restaurant, { foreignKey : "restaurantId"})
DealsCategory.hasMany(Deals, { foreignKey: "categoryId" })
// FavoriteRestaurant.belongsTo(User, { foreignKey: "userId" });
// FavoriteRestaurant.belongsTo(Restaurant, { foreignKey: "restaurantId" });

// ReservationDeals.belongsTo(Deals, { foreignKey: "dealId" })

const syncDB = async (options = { alter: false, force: true }) => {
  try {
    await sequelize.sync(options)
    console.log("Database synchronized successfully.")
  } catch (error) {
    console.error("Error during database synchronization:", error.message)
  }
}

syncDB({ alter: true, force: false })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})