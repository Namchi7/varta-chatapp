import express from "express";
import cors from "cors";

const app = express();

const CORS_ORIGIN_URI = process.env.CORS_ORIGIN_URI;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS Configuration

const corsOptions = {
  origin: CORS_ORIGIN_URI,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("/", cors(corsOptions));

// Router Imports

import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import chatsRouter from "./routes/chats.routes.js";

import asyncHandler from "./utils/asyncHandler.js";
import errorHandler from "./utils/errorHandler.js";
import CustomError from "./utils/customError.js";

// Router Configurations

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chats", chatsRouter);

app.get(
  "/api/*",
  asyncHandler((req, res, next) => {
    const err = new CustomError(
      404,
      `Cannot find ${req.originalUrl} on the server!`
    );

    next(err);
  })
);

app.use(errorHandler);

export { app };
