import { Router } from "express";
import {
  registerUser,
  loginUser,
  checkLogin,
  logoutUser,
  findUsernameInfo,
  usernameAvailable,
} from "../controllers/user.controller.js";
import { isUserLoggedIn } from "../middlewares/users.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/username-available").get(usernameAvailable);

// create a middleware "isUserLoggedIn" to check if user is logged-in
// Apply the middleware for below routes
// ex:- router.route("/check-login").post(isUserLoggedIn, checkLogin);

router.route("/check-login").get(isUserLoggedIn, checkLogin);
router.route("/find-username-info").get(isUserLoggedIn, findUsernameInfo);
router.route("/logout").get(isUserLoggedIn, logoutUser);

export default router;
