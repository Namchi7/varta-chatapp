import bcrypt from "bcryptjs";

import { getUser, createUser } from "../models/users.js";
import { setUserAuth, getUserAuth } from "./auth.js";

export const handleUserRegister = async (req, res, next) => {
  const { username, password, name } = req.query;
  const userInfo = await getUser(username);

  if (userInfo?.length !== 0) {
    console.log("User already exists.");
    res.json({ msg: "User already exists.", success: false });
  } else {
    await createUser({
      username,
      password,
      name,
    });

    req.username = username;

    next();
  }
};

export const handleUserLogin = async (req, res, next) => {
  const { username, password } = req.query;
  const userInfo = await getUser(username);

  if (userInfo?.length === 0) {
    console.log("User does not exist.");
    res.json({ msg: "User does not exist", loggedIn: false });
  } else {
    bcrypt.compare(password, userInfo[0].password, async (err, result) => {
      if (err) {
        console.log("Error occurred while comparing passwords.", err);
        res.json({
          msg: "Error occurred while comparing passwords.",
          loggedIn: false,
        });
      } else if (result) {
        const token = await setUserAuth(userInfo[0]);

        const days = 30;
        const expireTime = days * 24 * 3600 * 1000;

        res.cookie("authentication", token, {
          path: "/",
          sameSite: "none",
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + expireTime),
        });
        res.cookie.maxAge = expireTime;
        next();
      } else {
        console.log("Passwords do not match.");
        res.json({ error: "Passwords do not match.", loggedIn: false });
      }
    });
  }
};

export const checkUserLogin = async (req, res, next) => {
  if (!req.headers.cookie) return res.json({ loggedIn: false, username: "" });

  // Extracting JWT token parsed in cookies from headers
  const cookies = req.headers.cookie.split("; ");
  const cookie = cookies.filter((c) => c.startsWith("authentication="));

  const token = cookie[0].split("=")[1];

  // Decoding the token to extract the user data
  const dcd = getUserAuth(token);

  if (dcd === null) return res.json({ loggedIn: false, username: "" });
  if (!dcd?.username) return res.json({ loggedIn: false, username: "" });

  // Fetching the user data from the decoded token data
  const userInfo = await getUser(dcd.username);

  if (userInfo?.length === 0) {
    return res.json({ loggedIn: false, username: "" });
  }

  req.username = userInfo[0].username;
  req.name = userInfo[0].name;

  next();
};
