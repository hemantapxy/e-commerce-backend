import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phone: { type: String, default: "" },
    address: { type: String, default: "" },

    // Profile image (Cloudinary)
    profileImage: { type: String, default: "" },
    profileImageId: { type: String, default: "" },

    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
