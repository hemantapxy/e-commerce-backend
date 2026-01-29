import Product from "../models/Product.js";
import Order from "../models/Order.js";


/**
 * GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    // SEARCH: name, brand, price
    if (search) {
      const searchNumber = Number(search);

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];

      if (!isNaN(searchNumber)) {
        query.$or.push({ price: searchNumber });
      }
    }

    // CATEGORY (case-insensitive)
    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * POST /api/products 
 */
// controllers/productController.js
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, brand, variants } = req.body;

    if (!name || !price || !category || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "Required fields missing or variants not provided" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      brand,
      variants, // array of { color, image, stock }
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * POST /api/products/bulk
 */
export const addBulkProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array required" });
    }

    const validProducts = products.filter(
      p => p.name && p.price && p.category
    );

    const inserted = await Product.insertMany(validProducts);

    res.status(201).json({
      message: `${inserted.length} products added successfully`,
      insertedProducts: inserted.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Invalid product ID" });
  }
};

// POST /api/products/:id/review
// POST /api/products/:id/review
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    const userId = req.user._id;
    const username = req.user.username;

    // ✅ STEP 1: Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: userId,
      "items.product": productId,
      status: { $in: ["completed", "delivered"] },
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: "You can review this product only after purchasing it",
      });
    }

    // ✅ STEP 2: Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ❌ Prevent duplicate review
    const alreadyReviewed = product.reviews.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    // ✅ STEP 3: Add review
    product.reviews.push({
      userId,
      username,
      rating: Number(rating),
      comment,
    });

    // ✅ STEP 4: Update stats
    product.numReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.numReviews;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


