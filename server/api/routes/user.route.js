import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unFollowUser,
  updateUser,
} from "../controllers/user.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";
const router = express.Router();
router.get("/getUser/:id", getUser);
router.get("/getAllUsers", getAllUsers);
router.put("/updateUser/:id", authMiddleWare, updateUser);
router.delete("/deleteUser/:id", authMiddleWare, deleteUser);
router.put("/followUser/:id", authMiddleWare, followUser);
router.put("/unFollowUser/:id", authMiddleWare, unFollowUser);

export default router;
