import express from "express";
import { getProducts, addProduct, addBulkProducts, getProductById, addProductReview } from "../controllers/productController.js";
import auth from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);
router.post("/add-bulk", addBulkProducts);

// ✅ ADD review route with auth
router.post("/:id/review", auth, addProductReview);

export default router;
