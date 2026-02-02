// routes/bookingRoutes.ts
import { Router } from "express";
import {
  createBookingController,
  getBookingByIdController,
  getAllBookingsController,
  updateBookingController,
  deleteBookingController
} from "../bookings/bookings.controller";

const router = Router();

router.post("/", createBookingController);        // Create
router.get("/", getAllBookingsController);       // Get all
router.get("/:id", getBookingByIdController);    // Get by ID
router.put("/:id", updateBookingController);     // Update
router.delete("/:id", deleteBookingController);  // Delete

export default router;
