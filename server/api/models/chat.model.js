import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    members: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema, "chats");
export default Chat;
