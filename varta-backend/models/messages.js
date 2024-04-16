import { MessagesModel } from "./model.js";

export const createMessage = async (messageInfo) => {
  try {
    const newMessage = new MessagesModel({
      receiver_username: messageInfo.receiver,
      contact_username: messageInfo.sender,
      is_group_chat: messageInfo.is_group_chat,
      is_deleted: false,
      unseen: 1,
      text: messageInfo.text,
    });

    const result = await newMessage.save();

    if (result?.receiver_username === messageInfo.receiver) {
      return { result: result, success: true };
    } else {
      return {
        success: false,
        msg: "Message not created.",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllMessages = async (username, contact) => {
  try {
    // const messages = await MessagesModel.find({
    //   receiver_username: username,
    //   contact_username: contact,
    // }).sort({ createdAt: -1 });

    const messages = await MessagesModel.aggregate([
      {
        $match: {
          $or: [
            {
              receiver_username: username,
              contact_username: contact,
            },
            {
              receiver_username: contact,
              contact_username: username,
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    return messages;
  } catch (error) {
    console.log(error);
  }
};

export const markReadMessages = async (messageInfo) => {
  try {
    const result = await MessagesModel.updateMany(
      {
        receiver_username: messageInfo.username,
        contact_username: messageInfo.contact_username,
        unseen: 1,
      },
      { $set: { unseen: 0 } }
    );

    if (result.modifiedCount > 0) {
      console.log("Message seen.");
      return {
        success: true,
        msg: "Message marked as read.",
      };
    } else {
      console.log("Message unseen.");
      return {
        success: false,
        msg: "Message not marked as read.",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const editMessage = async (messageInfo) => {
  try {
    const result = await MessagesModel.updateOne(
      { _id: messageInfo.id },
      { $set: { text: messageInfo.text } }
    );

    if (result.modifiedCount > 0) {
      console.log("Message edited successfully.");
      return { success: true };
    } else {
      console.log("Message edit failed.");
      return { success: false };
    }
  } catch (error) {
    console.log(error);
  }
};
export const deleteMessage = async (messageId) => {
  try {
    const result = await MessagesModel.updateOne(
      { _id: messageId },
      { $set: { text: "This message has been deleted.", is_deleted: true } }
    );

    if (result.modifiedCount > 0) {
      console.log("Message status changed to deleted.");
      return { success: true };
    } else {
      console.log("Could not delete message.");
      return { success: false };
    }
  } catch (error) {
    console.log(error);
  }
};
