import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  refreshToken,
} from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/userRegister", userRegister);
authRouter.post("/userLogin", userLogin);
authRouter.post("/userLogout", auth, userLogout);
authRouter.get("/refreshToken", refreshToken);
export default authRouter;
