import express from "express";
import { createPaymentOrder } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";
import { verifyPaymentAndCreateBooking } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/verify", verifyPaymentAndCreateBooking);

router.post("/create", auth, createPaymentOrder);

export default router;
