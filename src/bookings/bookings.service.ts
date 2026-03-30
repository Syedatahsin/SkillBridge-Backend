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
  // 1. Check for any existing booking for this slot
  const existingBooking = await prisma.booking.findUnique({
    where: { availabilityId: availabilityId }
  });

  if (existingBooking) {
    // 🛑 Case 1: Already paid. Nobody else can touch it.
    if (existingBooking.status === "CONFIRMED") {
      throw new Error("This session is already booked and paid for.");
    }

    // ⏳ Case 2: It's PENDING. Is it a "Fresh" lock or an "Old" one?
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const isOldBooking = existingBooking.createdAt < fifteenMinutesAgo;

    if (existingBooking.status === "PENDING") {
      // If it's the SAME student, let them try again regardless of time
      if (existingBooking.studentId === studentId) {
        return existingBooking;
      }

      // If it's a NEW student (Student B) and the old lock is EXPIRED
      if (isOldBooking) {
        // Delete the old abandoned booking to free up the slot
        await prisma.booking.delete({ where: { id: existingBooking.id } });
        // The code will now continue down to create a new one for Student B
      } else {
        // It's a fresh lock (less than 15 mins old). Student B must wait.
        throw new Error("Someone is currently in the middle of paying for this. Please try again in 15 minutes.");
      }
    }
  }

  // 2. Create the new booking (for Student B or a fresh attempt)
  const generatedLink = `https://meet.jit.si/skillbridge-${availabilityId.slice(0, 8)}`;
  return await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      availabilityId,
      meetingLink: meetingLink || generatedLink, 
      status: "PENDING",
    },
  });
};
export const BookingService = {
  
  async getTeacherBookings(identifier: string) {
    // 1. Find the profile first
    const profile = await prisma.tutorProfile.findFirst({
      where: {
        OR: [
          { id: identifier },
          { userId: identifier }
        ]
      }
    });

    if (!profile) {
      console.log(`[Service] No TutorProfile found for: ${identifier}`);
      return { bookings: [], totalEarnings: 0 }; 
    }

    // 2. Fetch all bookings with ALL payment fields
    const bookings = await prisma.booking.findMany({
      where: {
        tutorId: profile.id
      },
      include: {
        student: {
          select: {
            name: true,
            image: true,
            email: true
          }
        },
        availability: {
          select: {
            startTime: true,
            endTime: true
          }
        },
        // CHANGED: Include the entire payment record without specifying fields
        payment: true 
      },
      orderBy: {
        availability: {
          startTime: "asc"
        }
      }
    });

    // 3. Calculate total balance
    const totalEarnings = bookings.reduce((sum, booking) => {
      // Check if payment exists and status is successful/completed
      // Note: Use the exact status string your DB uses (e.g., "COMPLETED", "PAID", or "SUCCESS")
      if (booking.payment && (booking.payment.status === "COMPLETED" || booking.payment.status === "PAID")) {
        return sum + (booking.payment.amount || 0);
      }
      return sum;
    }, 0);

    return {
      bookings,
      totalEarnings
    };
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
