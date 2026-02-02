// routes/bookingRoutes.ts
import { Router } from "express";
import {
  createBookingController,
  getBookingByIdController,
  getAllBookingsController,
  updateBookingController,
  deleteBookingController
} from "../bookings/bookings.controller";
import auth, { UserRole } from "../middlewares/auth";

const router = Router();

router.post("/", createBookingController);        // Create
router.get("/:id", getBookingByIdController);    // Get by ID
router.put("/:id", updateBookingController);     // Update
router.delete("/:id", deleteBookingController);  // Delete
// ADMIN
router.get("/admin/bookings",auth(UserRole.ADMIN), getAllBookingsController);       // Get all

export default router;
