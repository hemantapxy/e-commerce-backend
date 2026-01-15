import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: String,
  arrivalTime: String,
  duration: String,
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  image: { type: String, required: true },
});

export default mongoose.model("Flight", flightSchema);
