// services/bookingService.ts
import { prisma } from "../lib/prisma";

// Define BookingStatus manually since Prisma enum is not exported
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

// Create a new booking
export const createBooking = async (data: {
  studentId: string;
  tutorId: string;
  availabilityId: string;
  meetingLink?: string | null;
}) => {
  // Pass foreign keys directly; optional fields included conditionally
  const booking = await prisma.booking.create({
    data: {
      studentId: data.studentId,
      tutorId: data.tutorId,
      availabilityId: data.availabilityId,
      ...(data.meetingLink ? { meetingLink: data.meetingLink } : {}),
      // status defaults to CONFIRMED in your Prisma schema
    },
    include: {
      student: true,
      tutor: true,
      availability: true,
      review: true,
    },
  });

  return booking;
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
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
};
