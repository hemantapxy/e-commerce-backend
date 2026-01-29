import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.product");
    res.status(200).json({ items: wishlist?.items || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] });

    if (wishlist.items.some(i => i.product.toString() === productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();
    const populated = await wishlist.populate("items.product");
    res.status(200).json({ items: populated.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(i => i.product.toString() !== productId);
    await wishlist.save();
    const populated = await wishlist.populate("items.product");
    res.status(200).json({ items: populated.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
