import express from "express";
import { createPaymentOrder } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createPaymentOrder);

export default router;
