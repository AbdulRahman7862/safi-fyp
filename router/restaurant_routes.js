import express from "express";
import { createRestaurant, getAllRestaurants, getRestaurantNameByUserId, getRestaurants } from "../controller/restaurant_controller.js";
import upload from "../middleware/multer.js";
import RestaurantService from "../services/restaurant_service.js";

const router = express.Router();

const restaurantService = new RestaurantService();  
router.post("/create", upload.single("image"), createRestaurant); 
router.get("/all", getAllRestaurants);
router.get("/", getRestaurants);
router.get("/name/user/:userId", getRestaurantNameByUserId);



export default router;
