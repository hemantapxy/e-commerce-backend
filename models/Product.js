import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: String, index: true },
    price: { type: Number, required: true },
    image: { type: String },
    affiliateUrl: { type: String }, // optional for future Flipkart/Amazon links
    brand: { type: String },         // optional for real products
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
