import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  searchUser,
  suggestionsUser,
  unFollowUser,
  updateUser,
} from "../controllers/user.controller.js";

import auth from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/getUser/:id", auth, getUser);
userRouter.get("/getAllUsers", auth, getAllUsers);
userRouter.put("/updateUser", auth, updateUser);
userRouter.delete("/deleteUser/:id", auth, deleteUser);
userRouter.put("/followUser/:id", auth, followUser);
userRouter.put("/unFollowUser/:id", auth, unFollowUser);
userRouter.get("/searchUser", auth, searchUser);
userRouter.get("/suggestionsUser", auth, suggestionsUser);

export default userRouter;
