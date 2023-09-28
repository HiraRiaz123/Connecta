import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  getComment,
} from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/createComment", auth, createComment);
commentRouter.get("/getComment/:id", auth, getComment);
commentRouter.delete("/deleteComment/:id", auth, deleteComment);

export default commentRouter;
