import Product from "../models/Product.js";

/**
 * GET /api/products
 * Example searches:
 * /api/products?search=iphone
 * /api/products?category=Mobile
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
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
 * POST /api/products/dummy
 * Creates 100 professional dummy products (run once)
 */
export const createDummyProducts = async (req, res) => {
  try {
    const categories = ["Mobile", "Laptop", "Electronics", "Fashion", "Shoes"];

    const products = [];

    for (let i = 1; i <= 100; i++) {
      products.push({
        name: `iPhone ${i}`,
        description: "Latest smartphone with advanced features",
        category: categories[i % categories.length],
        price: Math.floor(Math.random() * 50000) + 10000, // random price 10k-60k
        image: `https://picsum.photos/300?random=${i}`,
        brand: "Apple",
        affiliateUrl: "", // empty for now; can add real API links later
      });
    }

    await Product.insertMany(products);

    res.json({ message: "Professional dummy products created successfully", count: products.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
