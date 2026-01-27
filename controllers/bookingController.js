import Booking from "../models/Booking.js";

/**
 * @desc   Get all bookings of logged-in user
 * @route  GET /api/bookings/my-bookings
 * @access Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("flight")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get My Bookings Error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/**
 * @desc   Get single booking by ID (for ticket page refresh safety)
 * @route  GET /api/bookings/:id
 * @access Private
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("flight")
      .populate("user", "email username");

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // Security check
    if (booking.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized access" });

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get Booking Error:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};
