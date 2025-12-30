import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendOrderEmail } from "../utils/email.js";

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(400).json({ message: "User email not found" });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user.id,
      items: cart.items,
      totalAmount,
      orderStatus: "Placed",
    });

    await order.save();

    // ✅ SEND EMAIL
    await sendOrderEmail(user.email, {
      _id: order._id,
      totalAmount: order.totalAmount,
      items: cart.items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed & email sent", order });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= MY ORDERS ================= */
export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
