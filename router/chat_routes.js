import express from "express";
import { getChatHistory, sendMessage } from "../controller/chat_controller.js";

const router = express.Router();

// Get chat history between user and restaurant
router.get("/history/:userId/:restaurantId", getChatHistory);
// Optional: send a message via REST (for testing)
router.post("/send", sendMessage);

export default router; 