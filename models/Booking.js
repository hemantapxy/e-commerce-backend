import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "paid" },
  passengers: [
    {
      id: String,
      name: String,
      age: Number,
    },
  ],
  bookedAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
