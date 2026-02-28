// services/bookingService.ts
import { prisma } from "../lib/prisma";

// Define BookingStatus manually since Prisma enum is not exported
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

// Create a new booking
import { Request, Response } from "express";
export const studentBookingService = {
  // Logic to get the student's classes + Teacher's User Name
  async fetchStudentSchedule(studentUserId: string) {
    return await prisma.booking.findMany({
      where: {
        studentId: studentUserId,
      },
      include: {
        availability: true, // For dates and times
        tutor: {
          include: {
            user: {
              select: {
                name: true, // This allows {session.tutor?.user?.name} in your UI
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Logic to change status to CANCELLED
  async cancelBooking(bookingId: string) {
    return await prisma.booking.update({
      where: {
        id: bookingId
      },
      data: {
        status: "CANCELLED"
      }
    });
  }
};





















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
export const BookingService = {
  /**
   * Fetches all bookings for a teacher.
   * Handles both the User ID (auth) or the TutorProfile ID.
   */
  async getTeacherBookings(identifier: string) {
    // 1. Find the profile first by checking both ID columns
    const profile = await prisma.tutorProfile.findFirst({
      where: {
        OR: [
          { id: identifier },      // e.g., "a26404ee-..."
          { userId: identifier }   // e.g., "apWRppI6..."
        ]
      }
    });

    // Logging for your terminal debugging
    if (!profile) {
      console.log(`[Service] No TutorProfile found for: ${identifier}`);
      return []; 
    }

    console.log(`[Service] Fetching bookings for TutorProfile: ${profile.id}`);

    // 2. Fetch all bookings linked to this specific TutorProfile
    return await prisma.booking.findMany({
      where: {
        tutorId: profile.id
      },
      include: {
        // Direct relation to User model in your schema
        student: {
          select: {
            name: true,
            image: true,
            email: true
          }
        },
        // Link to the specific time slot
        availability: {
          select: {
            startTime: true,
            endTime: true
          }
        }
      },
      orderBy: {
        availability: {
          startTime: "asc"
        }
      }
    });
  },

  /**
   * Updates a specific booking status to COMPLETED
   */
  async markAsCompleted(bookingId: string) {
    // Check if it exists before trying to update to avoid Prisma errors
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new Error("Booking record not found in database");
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED" // Must match your Enum exactly
      }
    });
  },

  /**
   * Optional: Cancel a booking and release the availability slot
   */
  
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


export const getAllBookings = async (page: number, limit: number) => {
  // Use a dynamic query object exactly like your sample
  const queryOptions: any = {
    include: {
      student: {
        select: { name: true, image: true, email: true }
      },
      tutor: {
        include: { user: { select: { name: true } } }
      },
      availability: true,
      review: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  };

  // ONLY add pagination if limit is greater than 0
  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }

  // Execute queries in parallel using Promise.all
  const [data, totalCount] = await Promise.all([
    prisma.booking.findMany(queryOptions),
    prisma.booking.count(),
  ]);

  return {
    data,
    meta: {
      total: totalCount,
      page: page,
      limit: limit,
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1,
    },
  };
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
