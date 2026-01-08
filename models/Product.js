import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  brand: String,
  image: String,
  colors: [String],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }, // store average
  numReviews: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
