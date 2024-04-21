import {
  createMessage,
  getAllMessages,
  markReadMessages,
} from "../models/messages.js";

import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/customError.js";
import {
  isInvalidTextMessage,
  isInvalidUsername,
} from "../utils/parameterValidation.js";

export const createNewMessage = asyncHandler(async (req, res) => {
  const { receiver, text } = req.body;

  if (isInvalidUsername(receiver) || isInvalidTextMessage(text)) {
    throw new CustomError(401, "Invalid username or text.");
  } else {
    const username = req.username;

    const messageInfo = {
      sender: username,
      receiver: receiver,
      is_group_chat: false,
      text: text,
    };

    const result = await createMessage(messageInfo);

    if (result?.success) {
      res.status(200).json({
        status: 200,
        message: "Message Created.",
        success: true,
        data: result.result,
      });
    } else {
      res
        .status(200)
        .json({ status: 200, message: result?.msg, success: false });
    }
  }
});

export const getConversation = asyncHandler(async (req, res) => {
  const { contact } = req.query;

  if (isInvalidUsername(contact)) {
    throw new CustomError(401, "Invalid username.");
  } else {
    const username = req.username;
    const chatMessages = await getAllMessages(username, contact);

    res.status(200).json({
      status: 200,
      message: "Data for the conversation.",
      data: chatMessages,
    });
  }
});

export const markMessageAsRead = asyncHandler(async (req, res) => {
  const { contact } = req.body;

  if (isInvalidUsername(contact)) {
    throw new CustomError(401, "Invalid username.");
  } else {
    const username = req.username;

    const result = await markReadMessages({
      username: username,
      contact_username: contact,
    });

    res.status(200).json({ status: 200, data: result });
  }
});
