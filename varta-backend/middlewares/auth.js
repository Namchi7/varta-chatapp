import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET = process.env.SECRET_JWT_KEY;

export const setUserAuth = async (user) => {
  if (!user) return null;

  try {
    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        // exp: Math.floor(Date.now() / 1000) + 180 * 24 * 60 * 60,
      },
      SECRET,
      {
        expiresIn: 30 * 24 * 60 * 60,
      }
    );

    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserAuth = (token) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET);

    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
};
