// controllers/bookingController.ts
import { Request, Response, NextFunction } from "express";
import { bookingService, BookingService, studentBookingService } from "../bookings/bookings.service";

export const studentBookingController = {
  // GET: Fetch sessions where the logged-in user is the student
  async getStudentBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Valid Student User ID is required" });
      }

      const bookings = await studentBookingService.fetchStudentSchedule(userId);
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  // PATCH: Cancel a booking
  async cancelByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Booking ID is required" });
      }

      const cancelledBooking = await studentBookingService.cancelBooking(id as any);

      return res.status(200).json({
        success: true,
        message: "Booking has been cancelled",
        data: cancelledBooking
      });
    } catch (error) {
      next(error);
    }
  }
};

export const BookingController = {
  async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const bookings = await BookingService.getTeacherBookings(String(userId));
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  async completeBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await BookingService.markAsCompleted(id as any);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

export const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId, tutorId, availabilityId, meetingLink } = req.body;

    if (!studentId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    const booking = await bookingService.createBookingService(
      studentId,
      tutorId,
      availabilityId,
      meetingLink
    );

    return res.status(201).json({
      success: true,
      data: booking,
    });

  } catch (error) {
    next(error);
  }
};

// Get Booking by ID
export const getBookingByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const booking = await bookingService.getBookingById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const getAllBookingsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const page = Number(req.query.page) || 1;

    const result = await bookingService.getAllBookings(page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Update Booking
export const updateBookingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const data = req.body;
    const updated = await bookingService.updateBooking(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete Booking
export const deleteBookingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const deleted = await bookingService.deleteBooking(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};