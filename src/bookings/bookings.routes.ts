// routes/bookingRoutes.ts
import { Router } from "express";
import {
  createBookingController,
  getBookingByIdController,
  getAllBookingsController,
  updateBookingController,
  deleteBookingController,
  
} from "../bookings/bookings.controller";
import auth, { UserRole } from "../middlewares/auth";
import { studentBookingController } from './bookings.controller';
import { BookingController } from './bookings.controller';

const bookingrouter = Router();

// 1. SPECIFIC ROUTES FIRST
bookingrouter.get("/bookings", getAllBookingsController);
bookingrouter.get("/tutorbookings", BookingController.getMyBookings);
bookingrouter.get("/studentbookings", studentBookingController.getStudentBookings);

bookingrouter.patch("/tutorbookings/complete/:id", BookingController.completeBooking);
bookingrouter.patch("/studentbookings/cancel/:id", studentBookingController.cancelByStudent);

// 2. DYNAMIC PARAMETER ROUTES LAST
bookingrouter.post("/", createBookingController);  
bookingrouter.get("/:id", getBookingByIdController);    
bookingrouter.put("/:id", updateBookingController);    
bookingrouter.delete("/:id", deleteBookingController);  

export default bookingrouter;