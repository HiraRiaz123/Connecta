import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createChat,
  findChat,
  userChats,
} from "../controllers/chat.controller.js";
const chatRouter = express.Router();

chatRouter.post("/createChat", auth, createChat);
chatRouter.get("/userChats/:userId", auth, userChats);
chatRouter.get("/findChat/:firstId/:secondId", auth, findChat);

export default chatRouter;
