import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/users.middleware.js";
import { getChats } from "./../controllers/chats.controller.js";

const router = Router();

router.route("/chats").get(isUserLoggedIn, getChats);

export default router;
