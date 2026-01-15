import express from "express";
import { getAllFlights, getFlightById ,addFlight} from "../controllers/flightController.js";

const router = express.Router();
router.post("/", addFlight);
router.get("/", getAllFlights);
router.get("/:id", getFlightById);

export default router;
