import express from "express";
import filterRestaurants from "../controller/filter_restaurant.js";

const router = express.Router();
router.post("/filter", filterRestaurants);

export default router;