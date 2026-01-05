import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendOrderEmail } from "../utils/email.js";
import { generateInvoice } from "../utils/invoiceGenerator.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE RAZORPAY ORDER ================= */
export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `order_${Date.now()}`,
  });

  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    order,
  });
};

/* ================= VERIFY PAYMENT + SAVE ORDER ================= */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 🔥 PAYMENT VERIFIED — NOW CREATE ORDER
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    // ✅ Filter out null products
    const validItems = cart.items.filter((item) => item.product !== null);

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }

    // ✅ Calculate total safely
    const totalAmount = validItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // ✅ Create order with only valid items
    const order = await Order.create({
      user: req.user.id,
      items: validItems,
      totalAmount,
      paymentStatus: "PAID",
      paymentId: razorpay_payment_id,
    });

    await order.populate("items.product");

    // ✅ Clear cart
    cart.items = [];
    await cart.save();

    const user = await User.findById(req.user.id);

    const invoicePath = await generateInvoice(order, user);
    await sendOrderEmail(user.email, order, invoicePath);

    res.json({
      success: true,
      message: "Payment success, order placed",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

/* ================= MY ORDERS ================= */
export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate("items.product");

  // ✅ Filter null products from each order
  const cleanedOrders = orders.map((order) => ({
    ...order._doc,
    items: (order.items || []).filter((item) => item.product !== null),
  }));

  res.json(cleanedOrders);
};
