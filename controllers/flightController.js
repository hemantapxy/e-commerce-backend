import Flight from "../models/Flight.js";

export const getAllFlights = async (req, res) => {
  const flights = await Flight.find();
  res.json(flights);
};

export const getFlightById = async (req, res) => {
  const flight = await Flight.findById(req.params.id);
  if (!flight) return res.status(404).json({ message: "Flight not found" });
  res.json(flight);
};


export const addFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({
      message: "Flight added successfully",
      flight,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
