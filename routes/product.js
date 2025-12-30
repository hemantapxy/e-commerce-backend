import express from "express";
import { getProducts, createDummyProducts } from "../controllers/productController.js";

const router = express.Router();

// Get products (with optional search & category filter)
router.get("/", getProducts);

// Create professional dummy products (run only once)
router.post("/dummy", createDummyProducts);

export default router;
