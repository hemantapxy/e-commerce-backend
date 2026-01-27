import Order from "../models/Order.js";

const checkPurchased = async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const order = await Order.findOne({
    user: userId,
    "items.product": productId,
    status: { $in: ["paid", "delivered"] }
  });

  if (!order) {
    return res.status(403).json({
      message: "You must purchase this product to submit a review"
    });
  }

  next();
};

export default checkPurchased;
