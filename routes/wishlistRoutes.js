import express from "express";
import auth from "../middleware/auth.js";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", auth, getWishlist);
router.post("/add", auth, addToWishlist);
router.post("/remove", auth, removeFromWishlist);

export default router;
