import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getTimeLinePosts,
  likePost,
  sharePost,
  updatePost,
} from "../controllers/post.controller.js";
const router = express.Router();

router.post("/createPost", createPost);
router.get("/getPost/:id", getPost);
router.put("/updatePost/:id", updatePost);
router.delete("/deletePost/:id", deletePost);
router.put("/likePost/:id", likePost);
router.get("/getTimeLinePosts/:id", getTimeLinePosts);
router.post("/sharePost/:id", sharePost);

export default router;
