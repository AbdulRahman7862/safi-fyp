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
// import cors from "cors";
// import express from "express";
// import morgan from "morgan";
// import { connectDB, sequelize } from "./config/db.js";
// import areaRoutes from "./router/area_router.js";
// import bookingRoutes from "./router/booking_router.js";
// import categoryRoutes from "./router/category_routes.js";
// import dealRoutes from "./router/deal_router.js";
// import favoriteRoutes from "./router/favorite_restaurant_router.js";
// import filterReservation from "./router/filter_reservation_router.js";
// import filterRoutes from "./router/filter_restaurant.js";
// import reservationRoutes from "./router/reservation_routes.js";
// import resetRoutes from "./router/reset_password.js";
// import restaurantRoutes from "./router/restaurant_routes.js";
// import roleRoutes from "./router/role_routes.js";
// import userRoutes from "./router/user_routes.js";

// // Model Imports
// import Area from "./model/area_model.js";
// import DealsCategory from "./model/deal_category_model.js";
// import DealMenuItem from "./model/deal_menu_items.js";
// import Deals from "./model/deals.js";
// import Reservation from "./model/reservation_model.js";
// import Restaurant from "./model/restaurant_model.js"; // Ensure this is imported
// import Role from "./model/role_model.js";
// import SeatingTable from "./model/seating_table.js";
// import User from "./model/user_model.js";

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(morgan("dev"));

// // Stripe Webhook Route (must come before express.json() for raw body)
// // app.post(
// //   "/webhook",
// //   express.raw({ type: "application/json" }),
// //   stripeWebhook.handleWebhook // Ensure handleWebhook is defined in reservation_service.js
// // );

// // Routes
// app.use("/api/filter-reservations", filterReservation);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/filters", filterRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/roles", roleRoutes);
// app.use("/api/restaurants", restaurantRoutes);
// app.use("/api/reservations", reservationRoutes);
// app.use("/api/deals", dealRoutes);
// app.use("/api/reset", resetRoutes);
// app.use("/api/areas", areaRoutes);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/categories", categoryRoutes);

// // Model Associations
// const initializeAssociations = () => {
//   // User-Role
//   User.belongsTo(Role, { foreignKey: "roleId" });

//   // User-Restaurant
//   User.hasOne(Restaurant, { foreignKey: "userId" });
//   Restaurant.belongsTo(User, { foreignKey: "userId" });

//   // Restaurant-Deals
//   Restaurant.hasMany(Deals, { foreignKey: "restaurant_id", as: "deals" });
//   Deals.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

//   // Reservation
//   Reservation.belongsTo(User, { foreignKey: "userId" });
//   Reservation.belongsTo(Restaurant, { foreignKey: "restaurantId" });

//   // Area
//   Area.belongsTo(Restaurant, { foreignKey: "restaurantId" });

//   // Deals-Category
//   Deals.belongsTo(DealsCategory, { foreignKey: "dealCategoryId" });
//   DealsCategory.hasMany(Deals, { foreignKey: "dealCategoryId" });
//   Deals.belongsTo(DealsCategory, { foreignKey: "categoryId", as: "category" });
//   DealsCategory.hasMany(Deals, { foreignKey: "categoryId" });

//   // Deal-MenuItem
//   DealMenuItem.belongsTo(Deals, { foreignKey: "dealId" });

//   // SeatingTable-Area
//   SeatingTable.belongsTo(Area, { foreignKey: "areaId" });
// };

// // Initialize database and associations
// const syncDB = async (options = { alter: true, force: false }) => {
//   try {
//     await connectDB(); // Connect to the database
//     initializeAssociations(); // Set up model associations
//     await sequelize.sync(options); // Sync models
//     console.log("Database synchronized successfully.");
//   } catch (error) {
//     console.error("Error during database synchronization:", error.message);
//     process.exit(1); // Exit on failure
//   }
// };

// // Start the server
// const PORT = process.env.PORT || 3000;
// const startServer = async () => {
//   await syncDB();
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();