import mongoose from "mongoose";

const { Schema } = mongoose;

const refreshTokenSchema = Schema(
  {
    token: { type: String, required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
  "tokens"
);
export default RefreshToken;
