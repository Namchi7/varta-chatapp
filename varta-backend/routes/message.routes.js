import { Router } from "express";
import {
  createNewMessage,
  getConversation,
  markMessageAsRead,
} from "../controllers/message.controller.js";
import { isUserLoggedIn } from "./../middlewares/users.middleware.js";

const router = Router();

router.route("/create-message").post(isUserLoggedIn, createNewMessage);
router.route("/chat-messages").get(isUserLoggedIn, getConversation);
router.route("/mark-as-read").patch(isUserLoggedIn, markMessageAsRead);

export default router;
