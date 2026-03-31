// controllers/bookingController.ts
import { Request, Response, NextFunction } from "express";
import { bookingService, BookingService, studentBookingService } from "../bookings/bookings.service";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";

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
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // 1. DATABASE STEP: Create the PENDING booking first
    // This uses your existing service we modified to default to "PENDING"
    const booking = await bookingService.createBookingService(
      studentId,
      tutorId,
      availabilityId,
      meetingLink
    );

    // 2. FETCH TUTOR STEP: We need the price from the DB (don't trust frontend price!)
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true } // to get the teacher's name for the Stripe UI
    });

    if (!tutor) throw new Error("Tutor not found");

    // 3. STRIPE STEP: Ask Stripe for a Checkout URL
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: `Session with ${tutor.user?.name || 'Tutor'}`,
            description: `Booking ID: ${booking.id}` 
          },
          unit_amount: Math.round(tutor.pricePerHour * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
        // Where to send the user after they finish
        success_url: `${process.env.FRONTEND_URL}/payment-success}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-failed}`,
      // IMPORTANT: Hide the booking ID in metadata so the Webhook can find it later
      metadata: {
        bookingId: booking.id,
      },
    });

    // 4. RESPONSE STEP: Send the Stripe URL to the frontend
    // The frontend will use this to redirect the student
    return res.status(201).json({
      success: true,
      url: session.url, // <--- This is the golden ticket!
      bookingId: booking.id,
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