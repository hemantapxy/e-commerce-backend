import express from "express";
import auth from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  getCartCount
} from "../controllers/cartController.js";

const router = express.Router();

// Get full cart
router.get("/", auth, getCart);

// Get cart item count (Flipkart style)
router.get("/count", auth, getCartCount);

// Add product to cart
router.post("/add", auth, addToCart);

// Remove product from cart
router.post("/remove", auth, removeFromCart);

export default router;
