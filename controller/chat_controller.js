import ChatService from "../services/chat_service.js";

const getChatHistory = async (req, res) => {
  try {
    const { userId, restaurantId } = req.params;
    if (!userId || !restaurantId) {
      return res.status(400).json({ success: false, message: "userId and restaurantId are required." });
    }
    const messages = await ChatService.getMessages(userId, restaurantId);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Optional: REST endpoint to send a message (for testing, not for real-time)
const sendMessage = async (req, res) => {
  try {
    const { userId, restaurantId, senderType, message } = req.body;
    if (!userId || !restaurantId || !senderType || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    const saved = await ChatService.saveMessage({ userId, restaurantId, senderType, message });
    res.status(201).json({ success: true, message: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getChatHistory, sendMessage }; 