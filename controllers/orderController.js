import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = new Order({ user: req.user._id, items: cart.items, totalPrice });
  await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");
  res.status(200).json(orders);
};
