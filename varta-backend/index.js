import "dotenv/config";
import { Server } from "socket.io";

import { app } from "./app.js";

const PORT = process.env.PORT;
const CORS_ORIGIN_URI = process.env.CORS_ORIGIN_URI;

const server = app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN_URI,
    method: ["GET", "POST"],
  },
});

// const users = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id, socket.handshake.query.username);
  // users[socket.handshake.query.username] = socket.id;

  socket["userId"] = socket.handshake.query.username;
  console.log(socket.userId);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("new-message", (msg) => {
    console.log(msg.recipientId, socket.userId, "See here ^^^^^^^^^^^");
    // const receiver = users[msg.recipientId];
    socket.in(msg.recipientId).emit("new-message", msg.message_data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
