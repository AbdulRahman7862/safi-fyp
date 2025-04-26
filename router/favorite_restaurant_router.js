import express from "express";
import { addToFavorite, getUserFavorite } from "../controller/favorite_restaurant_controller.js";

const router = express.Router()

router.post("/add", addToFavorite)
router.get("/:userId", getUserFavorite);

export default router;