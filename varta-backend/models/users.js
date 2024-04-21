import { UsersModel } from "./model.js";

export const createUser = async (userInfo) => {
  try {
    const newUser = new UsersModel({
      username: userInfo.username,
      password: userInfo.password,
      name: userInfo.name,
    });

    const user = await newUser.save();
    return user;
    // const verdict = await newUser.save();
    // console.log(verdict);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (username) => {
  try {
    const userInfo = await UsersModel.find({ username: username });

    return userInfo;
  } catch (error) {
    console.log(error);
  }
};

export const searchUser = async (username) => {
  // try {
  const userInfo = await UsersModel.find(
    { username: { $regex: username } },
    { _id: 1, username: 1, name: 1 }
  );
  // console.log(username, userInfo);

  return userInfo;
  // } catch (error) {
  //   console.log(error);
  // }
};
