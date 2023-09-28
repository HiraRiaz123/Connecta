import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getSavedPosts,
  getTimeLinePosts,
  likePost,
  savePost,
  updatePost,
} from "../controllers/post.controller.js";

import auth from "../middlewares/auth.middleware.js";

const postRouter = express.Router();

postRouter.post("/createPost", auth, createPost);
postRouter.get("/getPost/:id", auth, getPost);
postRouter.put("/updatePost", auth, updatePost);
postRouter.delete("/deletePost/:id", auth, deletePost);
postRouter.put("/likePost/:id", auth, likePost);
postRouter.get("/getTimeLinePosts/:id", auth, getTimeLinePosts);
postRouter.patch("/savePost/:id", auth, savePost);
postRouter.get("/getSavedPosts", auth, getSavedPosts);

export default postRouter;
