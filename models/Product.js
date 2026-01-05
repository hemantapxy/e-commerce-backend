import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    price: { type: Number, required: true },
    brand: String,
    image: String, // image path
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
