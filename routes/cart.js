import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/remove/:productId", auth, removeFromCart);

export default router;
