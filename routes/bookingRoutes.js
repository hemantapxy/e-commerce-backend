import express from "express";
import { getMyBookings, getBookingById } from "../controllers/bookingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/my-bookings", auth, getMyBookings);
router.get("/:id", auth, getBookingById);

export default router;
    