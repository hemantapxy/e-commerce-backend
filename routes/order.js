import express from "express";
import { placeOrder, myOrders } from "../controllers/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/place", auth, placeOrder);
router.get("/my", auth, myOrders);

export default router;
