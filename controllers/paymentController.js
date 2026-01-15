import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Booking from "../models/Booking.js";

export const createPaymentOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ message: "Payment order failed" });
  }
};


export const verifyPaymentAndCreateBooking = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    flightId,
    userId,
    amount,
  } = req.body;

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // Create booking
  const booking = await Booking.create({
    userId,
    flightId,
    amount,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    signature: razorpay_signature,
    paymentStatus: "SUCCESS",
  });

  res.status(201).json({
    message: "Booking confirmed",
    booking,
  });
};