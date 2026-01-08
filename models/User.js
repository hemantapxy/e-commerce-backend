import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },

    // 🔐 ROLE (IMPORTANT)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // 👈 Every signup is USER
    },

    // 🔑 Forgot Password
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
