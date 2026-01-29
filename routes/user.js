import express from "express";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/profile/image", auth, upload.single("image"), updateProfileImage);

export default router;
