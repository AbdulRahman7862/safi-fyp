import { Server } from "socket.io";
import ChatService from "./services/chat_service.js";

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    // Join a room for user-restaurant chat
    socket.on("join_room", ({ userId, restaurantId }) => {
      const room = `chat_${userId}_${restaurantId}`;
      socket.join(room);
    });

    // Handle sending a message
    socket.on("send_message", async (data) => {
      // data: { userId, restaurantId, senderType, message }
      const room = `chat_${data.userId}_${data.restaurantId}`;
      // Save to DB
      const saved = await ChatService.saveMessage(data);
      // Emit to both user and restaurant in the room
      io.to(room).emit("receive_message", saved);
    });

    // Optionally handle disconnects, typing, etc.
  });
} 