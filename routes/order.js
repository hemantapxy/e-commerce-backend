import express from "express";
import { placeOrder, getOrders } from "../controllers/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/place", auth, placeOrder);
router.get("/", auth, getOrders);

export default router;
