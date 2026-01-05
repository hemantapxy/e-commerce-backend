import razorpay from "../config/razorpay.js";

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
