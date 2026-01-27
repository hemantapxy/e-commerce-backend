import express from "express";
import auth from "../middleware/auth.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  myOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", auth, createRazorpayOrder);
router.post("/verify", auth, verifyRazorpayPayment);
router.get("/my", auth, myOrders);


export default router;
