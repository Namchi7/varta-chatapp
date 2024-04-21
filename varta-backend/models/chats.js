import { MessagesModel } from "./model.js";

export const getAllChats = async (username) => {
  try {
    const chats = await MessagesModel.aggregate([
      {
        $facet: {
          receivers: [
            {
              $match: {
                $or: [
                  {
                    receiver_username: username,
                  },
                  {
                    contact_username: username,
                  },
                ],
              },
            },
            {
              $sort: {
                createdAt: -1,
                receiver_username: 1,
              },
            },
            {
              $group: {
                _id: "$receiver_username",
                // unseen_count: {
                //   $sum: "$unseen",
                // },
                text: {
                  $first: "$text",
                },
                time: {
                  $first: "$createdAt",
                },
              },
            },
            {
              $project: {
                username: "$_id",
                unseen_count: "$unseen_count",
                text: "$text",
                time: "$time",
              },
            },
          ],
          contacts: [
            {
              $match: {
                $or: [
                  {
                    receiver_username: username,
                  },
                  {
                    contact_username: username,
                  },
                ],
              },
            },
            {
              $sort: {
                createdAt: -1,
                contact_username: 1,
              },
            },
            {
              $group: {
                _id: "$contact_username",
                unseen_count: {
                  $sum: "$unseen",
                },
                text: {
                  $first: "$text",
                },
                time: {
                  $first: "$createdAt",
                },
              },
            },
            {
              $project: {
                username: "$_id",
                unseen_count: "$unseen_count",
                text: "$text",
                time: "$time",
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          users: {
            $concatArrays: ["$receivers", "$contacts"],
          },
        },
      },
      {
        $unwind: {
          path: "$users",
        },
      },
      {
        $sort: {
          "users.time": -1,
        },
      },
      {
        $group: {
          _id: "$users.username",
          unseen_count: {
            $sum: "$users.unseen_count",
          },
          text: {
            $first: "$users.text",
          },
          time: {
            $first: "$users.time",
          },
        },
      },
      {
        $project: {
          username: "$_id",
          unseen_count: "$unseen_count",
          text: "$text",
          time: "$time",
        },
      },
      {
        $match: {
          username: {
            $ne: username,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "username",
          foreignField: "username",
          as: "contact_info",
        },
      },
      {
        $project: {
          contact_username: "$username",
          text: "$text",
          time: "$time",
          unseen_count: "$unseen_count",
          contact_name: {
            $arrayElemAt: ["$contact_info.name", 0],
          },
        },
      },
      {
        $sort: {
          time: -1,
        },
      },
    ]);

    // chats.sort((a, b) => new Date(b.time) - new Date(a.time));

    return chats;
  } catch (error) {
    console.log(error);
  }
};
