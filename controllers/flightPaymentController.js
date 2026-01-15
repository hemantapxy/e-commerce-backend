import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Flight from "../models/Flight.js";
import Booking from "../models/Booking.js";

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;

    if (!flightId) {
      return res.status(400).json({ message: "Flight ID is required" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    const amount = flight.price * 100; // Razorpay expects paise

    // Short receipt to avoid Razorpay 40 char limit
    const receiptId = `rec_${flightId.slice(-10)}_${Date.now().toString().slice(-5)}`;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: receiptId,
    });

    console.log("Razorpay order created:", order);

    res.status(200).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify Razorpay Payment & Save Booking
export const verifyPayment = async (req, res) => {
  try {
    const { flightId, passengers, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!flightId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Validate Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    // Save booking
    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: flight.price,
      status: "paid",
      passengers,
    });

    console.log("Booking saved:", booking);

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};
