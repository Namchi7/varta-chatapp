import { getUser } from "../models/users.js";
import asyncHandler from "../utils/asyncHandler.js";
import CustomError from "../utils/customError.js";
import { getUserAuth } from "./auth.js";

export const isUserLoggedIn = asyncHandler(async (req, res, next) => {
  // Extracting JWT token parsed in cookies from headers
  const cookies = req.headers.cookie.split("; ");
  const cookie = cookies.filter((c) => c.startsWith("authentication="));

  const token = cookie[0].split("=")[1];

  // Decoding the token to extract the user data
  const dcd = getUserAuth(token);

  if (dcd === null) {
    throw new CustomError(400, "JWT token is invalid.");
    // return res.json({ loggedIn: false, username: "" });
  }
  if (!dcd?.username) {
    throw new CustomError(400, "JWT token is invalid.");
    // return res.json({ loggedIn: false, username: "" });
  }

  // Fetching the user data from the decoded token data
  const userInfo = await getUser(dcd.username);

  if (userInfo?.length === 0) {
    throw new CustomError(400, "JWT token populated with invalid username.");
    // return res.json({ loggedIn: false, username: "" });
  }

  req.username = userInfo[0].username;
  req.name = userInfo[0].name;

  next();
});
