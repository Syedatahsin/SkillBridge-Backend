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
router.delete("/:id", deleteBookingController);  // Delete
// ADMIN
router.get("/admin/bookings",auth(UserRole.ADMIN), getAllBookingsController);       // Get all
// STUDENT
router.get("/:id", getBookingByIdController);    
router.post("/", createBookingController);  
router.put("/:id", updateBookingController);     // Update
      // Create
// TUTOR
router.get("/:id", getBookingByIdController);    

export default router;
