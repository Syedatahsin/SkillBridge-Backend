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

const bookingrouter = Router();

bookingrouter.post("/", createBookingController);  
bookingrouter.delete("/:id", deleteBookingController);  // Delete
// ADMIN
bookingrouter.get("/admin/bookings",auth(UserRole.ADMIN), getAllBookingsController);       // Get all
// STUDENT
bookingrouter.get("/:id", getBookingByIdController);    
bookingrouter.put("/:id", updateBookingController);     // Update
      // Create
// TUTOR
bookingrouter.get("/:id", getBookingByIdController);    

export default bookingrouter;
