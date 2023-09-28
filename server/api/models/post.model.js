import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    description: { type: String, required: true },
    likes: [],
    filePath: { type: String, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", PostSchema, "posts");
export default Post;
