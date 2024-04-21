import bcrypt from "bcryptjs";

import { createUser, getUser, searchUser } from "../models/users.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  isInvalidName,
  isInvalidPassword,
  isInvalidUsername,
} from "../utils/parameterValidation.js";
import CustomError from "../utils/customError.js";
import { setUserAuth } from "../middlewares/auth.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, name } = req.body;

  if (isInvalidUsername(username)) {
    throw new CustomError(400, "Invalid username.");
  }

  if (isInvalidName(name)) {
    throw new CustomError(400, "Invalid name.");
  }

  if (isInvalidPassword(password)) {
    throw new CustomError(400, "Invalid password.");
  }

  const userInfo = await getUser(username);

  if (userInfo?.length !== 0) {
    throw new CustomError(
      400,
      `User with username: ${username}, already exists.`
    );
  }

  const savedUser = await createUser({ username, password, name });

  if (!savedUser?.username) {
    throw new CustomError(
      500,
      "Could not create user. Please try again later."
    );
  }

  res.status(200).json({
    status: 200,
    message: `'${username}' - User created successfully. Login to continue.`,
    username: username,
    success: true,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (isInvalidUsername(username)) {
    throw new CustomError(400, "Invalid username.");
  }

  if (isInvalidPassword(password)) {
    throw new CustomError(400, "Invalid password.");
  }

  const userInfo = await getUser(username);

  if (userInfo?.length === 0) {
    throw new CustomError(404, "User does not exist.");
  } else {
    bcrypt.compare(password, userInfo[0].password, async (err, result) => {
      if (err) {
        throw new CustomError(500, "Error occurred while comparing password.");
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

        res.status(200).json({
          status: 200,
          loggedIn: true,
          message: "User login successful.",
        });
      } else {
        res.status(401).json({
          status: 401,
          loggedIn: false,
          message: "Password does not match.",
        });
      }
    });
  }
});

export const findUsernameInfo = asyncHandler(async (req, res) => {
  const { username } = req.query;

  const users = await searchUser(username);

  res.status(200).json({ status: 200, data: users });
});

export const usernameAvailable = asyncHandler(async (req, res) => {
  const { username } = req.query;

  if (isInvalidUsername(username)) {
    throw new CustomError(400, "Invalid username.");
  } else {
    const users = await getUser(username);

    if (users?.length !== 0) {
      res.status(200).json({
        status: 200,
        isAvailable: false,
        message: "User already exists.",
      });
    } else {
      res.status(200).json({
        status: 200,
        isAvailable: true,
        message: "Username available.",
      });
    }
  }
});

export const checkLogin = async (req, res) => {
  // // Extracting JWT token parsed in cookies from headers
  // const cookies = req.headers.cookie.split("; ");
  // const cookie = cookies.filter((c) => c.startsWith("authentication="));

  // const token = cookie[0].split("=")[1];

  // // Decoding the token to extract the user data
  // const dcd = getUserAuth(token);

  // if (dcd === null) {
  //   throw new CustomError(400, "JWT token is invalid.");
  //   // return res.json({ loggedIn: false, username: "" });
  // }
  // if (!dcd?.username) {
  //   throw new CustomError(400, "JWT token is invalid.");
  //   // return res.json({ loggedIn: false, username: "" });
  // }

  // // Fetching the user data from the decoded token data
  // const userInfo = await getUser(dcd.username);

  // if (userInfo?.length === 0) {
  //   throw new CustomError(400, "JWT token populated with invalid username.");
  //   // return res.json({ loggedIn: false, username: "" });
  // }

  const username = req.username;
  const name = req.name;

  res
    .status(200)
    .json({ status: 200, loggedIn: true, username: username, name: name });
};

export const logoutUser = (req, res) => {
  const token = "";

  res.cookie("authentication", token, {
    path: "/",
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ status: 200, loggedIn: false, username: "" });
};
