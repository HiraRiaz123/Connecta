import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  unFollowUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();
router.get("/getUser/:id", getUser);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.put("/followUser/:id", followUser);
router.put("/unFollowUser/:id", unFollowUser);

export default router;
