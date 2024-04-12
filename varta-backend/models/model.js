import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 11);
  next();
});

export const UsersModel = new mongoose.model("Users", userSchema);

const messageSchema = new mongoose.Schema(
  {
    receiver_username: {
      type: String,
      required: true,
    },
    contact_username: {
      type: String,
      required: true,
    },
    is_group_chat: {
      type: Boolean,
      required: true,
    },
    is_deleted: {
      type: Boolean,
      required: true,
    },
    unseen: {
      type: Number,
      required: true,
      default: 1,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MessagesModel = new mongoose.model("Messages", messageSchema);
