import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user's cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

// Add product to cart
export const addToCart = async (req, res) => {
  const { productId } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (i) => i.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
    // ❌ do NOT update addedAt here
  } else {
    cart.items.push({
      product: productId,
      quantity: 1,
      addedAt: new Date(), // ✅ set when product added first time
    });
  }

  await cart.save();

  const updated = await Cart.findById(cart._id).populate("items.product");
  res.json(updated);
};


// Remove product from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(400).json({ message: "Cart not found" });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }
  }
  await cart.save();
  const updated = await Cart.findById(cart._id).populate("items.product");
  res.json(updated);
};
