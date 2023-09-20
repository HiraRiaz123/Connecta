import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./api/routes/auth.route.js";
import userRoute from "./api/routes/user.route.js";
import postRoute from "./api/routes/post.route.js";
import uploadRoute from "./api/routes/upload.route.js";
/* Routes*/

const app = express();
/* Middlewares*/
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(cors());

/*to serve images for public*/
app.use(express.static('public')); 
app.use('/images', express.static('images'));
dotenv.config();

// usage of routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/upload", uploadRoute);

/* Mongoose setup */
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
