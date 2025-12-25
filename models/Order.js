import mongoose from "mongoose";
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    { product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: Number, price: Number }
  ],
  totalAmount: Number,
  orderStatus: { type: String, default: "Placed" }
}, { timestamps: true });
export default mongoose.model("Order", schema);
