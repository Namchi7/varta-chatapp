import express from "express";
import "dotenv/config";
import cors from "cors";
import { Server } from "socket.io";
import {
  checkUserLogin,
  handleUserLogin,
  handleUserRegister,
} from "./middlewares/user.js";
import { createMessage, getAllMessages } from "./models/messages.js";
import { createUser, getUser, searchUser } from "./models/users.js";
import { getAllChats } from "./models/chats.js";

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN_URI = process.env.CORS_ORIGIN_URI;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = {
  origin: CORS_ORIGIN_URI,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("/", cors(corsOptions));

app.get("/chats", checkUserLogin, async (req, res) => {
  const username = req.username;

  const chats = await getAllChats(username);

  res.json(chats);
});

app.get("/find-username-info", checkUserLogin, async (req, res) => {
  const { username } = req.query;

  const users = await searchUser(username);

  res.json(users);
});

app.get("/username-available", async (req, res) => {
  const { username } = req.query;

  const users = await getUser(username);

  if (users.length !== 0) {
    res.json({ isAvailable: false, msg: "User already exists." });
  } else {
    res.json({ isAvailable: true, msg: "Username available." });
  }
});

app.get("/chat-messages", checkUserLogin, async (req, res) => {
  const { contact } = req.query;
  const username = req.username;
  const chatMessages = await getAllMessages(username, contact);

  res.json(chatMessages);
});

app.post("/create-message", checkUserLogin, async (req, res) => {
  const { contact, text } = req.query;
  const username = req.username;
  const messageInfo = {
    username: username,
    contact: contact,
    is_group_chat: false,
    text: text,
  };

  const result = await createMessage(messageInfo);

  if (result.success) {
    res.json({
      msg: "Message Created.",
      success: true,
      message_data: result.result,
    });
  } else {
    res.json({ msg: result.msg, success: false });
  }
});

app.get("/check-login", checkUserLogin, (req, res) => {
  const username = req.username;

  res.json({ loggedIn: true, username: username });
});

app.get("/login", handleUserLogin, (req, res) => {
  res.json({ msg: "User logged in successfully.", loggedIn: true });
});

app.post("/register", handleUserRegister, (req, res) => {
  const username = req.username;

  res.json({
    msg: `'${username}' - User created successfully.`,
    username: username,
    success: true,
  });
});

app.get("/logout", (req, res) => {
  const token = "";

  res.cookie("authentication", token, {
    path: "/",
    sameSite: "none",
    secure: true,
  });

  res.json({ loggedIn: false, username: "" });
});

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