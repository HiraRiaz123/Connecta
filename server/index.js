import express from "express";
import dbConnect from "./dependencies/connectionDb.js";
import { PORT } from "./dependencies/config.js";
import errorHandler from "./api/middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json({ limit: "50mb" }));

import authRoute from "./api/routes/auth.route.js";
app.use("/auth", authRoute);
import userRoute from "./api/routes/user.route.js";
app.use("/user", userRoute);
import postRoute from "./api/routes/post.route.js";
app.use("/post", postRoute);
import commentRoute from "./api/routes/comment.route.js";
app.use("/post/comment", commentRoute);
import chatRoute from "./api/routes/chat.route.js";
app.use("/chat", chatRoute);
import messageRoute from "./api/routes/message.route.js";
app.use("/message", messageRoute);

dbConnect();

app.use("/storage", express.static("storage"));

app.use(errorHandler);

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
