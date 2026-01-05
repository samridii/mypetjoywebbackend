import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);

