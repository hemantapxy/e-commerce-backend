import express from "express";
import {
  getProducts,
  addProduct,
  addBulkProducts,
  getProductById,   // 👈 ADD THIS
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

// 🔥 ADD THIS ROUTE
router.get("/:id", getProductById);

router.post("/", addProduct);
router.post("/add-bulk", addBulkProducts);

export default router;
