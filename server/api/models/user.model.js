import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      uppercase: true,
    },
    lastName: {
      type: String,
      required: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    profilePicturePath: { type: String },
    coverPicturePath: { type: String },
    phoneNumber: { type: String, default: "" },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    saved: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    livesIn: { type: String, default: "" },
    studyAt: { type: String, default: "" },
    worksAt: { type: String, default: "" },
    relationship: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  {
    timestamps: true,
    _id: true,
  }
);

const User = mongoose.model("User", UserSchema, "users");
export default User;
