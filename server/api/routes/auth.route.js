import express from "express";
import { userRegister, userLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);

export default router;
