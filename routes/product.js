import express from "express";
import { getProducts, createDummyProducts } from "../controllers/productController.js";

const router = express.Router();
router.get("/", getProducts);
router.post("/dummy", createDummyProducts); // optional: create 100 products

export default router;
