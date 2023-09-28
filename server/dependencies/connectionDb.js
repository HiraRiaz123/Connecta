import mongoose from "mongoose";
import { MONGODB_CONNECTION_STRING } from "./config.js";

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(`Database connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

export default dbConnect;
