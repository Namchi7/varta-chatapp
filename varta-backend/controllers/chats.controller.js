import { getAllChats } from "../models/chats.js";

import asyncHandler from "../utils/asyncHandler.js";

export const getChats = asyncHandler(async (req, res) => {
  const username = req.username;

  const chats = await getAllChats(username);

  res.status(200).json({ status: 200, data: chats });
});
