// controllers/bookingController.ts
import { Request, Response } from "express";
import { bookingService } from "../bookings/bookings.service";

// Create Booking
export const createBookingController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const booking = await bookingService.createBooking(data);
    res.status(201).json(booking);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Booking by ID
export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const booking = await bookingService.getBookingById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Bookings
export const getAllBookingsController = async (_req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Booking
export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const data = req.body;
    const updated = await bookingService.updateBooking(id, data);
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Booking
export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await bookingService.deleteBooking(id);
    res.json(deleted);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
