// services/bookingService.ts
import { prisma } from "../lib/prisma";

// Define BookingStatus manually since Prisma enum is not exported
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

// Create a new booking
import { Request, Response } from "express";

export const createBookingService = async (
  studentId: string,
  tutorId: string,
  availabilityId: string,
  meetingLink?: string
) => {
  // 1️⃣ Atomically mark the slot as booked
  const updatedSlot = await prisma.availability.updateMany({
    where: {
      id: availabilityId,
      isBooked: false, // only update if not already booked
    },
    data: {
      isBooked: true,
    },
  });

  // 2️⃣ If no slot was updated, it was already booked
  if (updatedSlot.count === 0) {
    throw new Error("This slot has already been taken.");
  }

  // 3️⃣ Create the booking
  const newBooking = await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      availabilityId,
      meetingLink: meetingLink || null,
      status: "CONFIRMED",
    },
  });

  return newBooking;
};
// Get a booking by ID
export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      student: true,
      tutor: true,
      availability: true,
      review: true,
    },
  });
};

// Get all bookings
export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: true,
      tutor: true,
      availability: true,
      review: true,
    },
  });
};

// Update a booking
export const updateBooking = async (
  id: string,
  data: Partial<{ status: BookingStatus; meetingLink?: string }>
) => {
  const updated = await prisma.booking.update({
    where: { id },
    data,
    include: {
      student: true,
      tutor: true,
      availability: true,
      review: true,
    },
  });

  return updated;
};

// Delete a booking
export const deleteBooking = async (id: string) => {
  return prisma.booking.delete({
    where: { id },
  });
};

// Export Booking service
export const bookingService = {
  createBookingService,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
};
