import Product from "../models/Product.js";

/**
 * GET /api/products
 * ?search=iphone&category=Mobile
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/products
 * Add REAL product with image
 */
/**
 * POST /api/products
 * Add REAL product with image URL
 */
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, brand, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      brand,
      image: image || null, // use image URL if provided
    });

    res.status(201).json({
      message: "Real product added successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/productController.js
export const addBulkProducts = async (req, res) => {
  try {
    const products = req.body; // expects an array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array required" });
    }

    // Optional: Validate each product
    const validProducts = products.filter(p => p.name && p.price && p.category);

    const inserted = await Product.insertMany(validProducts);

    res.status(201).json({
      message: `${inserted.length} products added successfully`,
      insertedProducts: inserted.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/products/:id
 * Get single product by ID
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
