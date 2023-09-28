import mongoose from "mongoose";

const { Schema } = mongoose;
const MessageSchema = new Schema(
  {
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema, "messages");
export default Message;
