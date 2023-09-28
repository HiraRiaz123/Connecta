import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createMessage,
  deleteMessage,
  getMessages,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/createMessage", auth, createMessage);
messageRouter.get("/getMessages/:chatId", auth, getMessages);
messageRouter.delete("/deleteMessage/:id", auth, deleteMessage);

export default messageRouter;
