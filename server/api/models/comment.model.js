import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    post: { type: mongoose.SchemaTypes.ObjectId, ref: "Post" },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema, "comments");
export default Comment;
