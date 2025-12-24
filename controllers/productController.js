import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Create 100 dummy products
export const createDummyProducts = async (req, res) => {
  for (let i = 1; i <= 100; i++) {
    await Product.create({
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 10000) + 100,
      image: `https://picsum.photos/200?random=${i}`
    });
  }
  res.json({ message: "100 dummy products created" });
};
