import ChatMessage from "../model/chat_message_model.js";

class ChatService {
  static async saveMessage({ userId, restaurantId, senderType, message }) {
    return await ChatMessage.create({
      userId,
      restaurantId,
      senderType,
      message,
      timestamp: new Date(),
    });
  }

  static async getMessages(userId, restaurantId) {
    return await ChatMessage.findAll({
      where: { userId, restaurantId },
      order: [["timestamp", "ASC"]],
    });
  }
}

export default ChatService; 