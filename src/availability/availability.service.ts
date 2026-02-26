// services/availabilityService.ts
import { prisma } from "../lib/prisma";

// Create Availability
// BACKEND: availability.service.ts
// availability.service.ts
export const createAvailability = async (data: { 
  tutorId: string; 
  startTime: string; 
  endTime: string; 
}) => {
  const cleanId = data.tutorId.trim();
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  // 1. Check for any overlapping slot for this tutor
  const overlap = await prisma.availability.findFirst({
    where: {
      tutorId: cleanId,
      OR: [
        {
          // New slot starts during an existing slot
          startTime: { lte: start },
          endTime: { gt: start },
        },
        {
          // New slot ends during an existing slot
          startTime: { lt: end },
          endTime: { gte: end },
        },
        {
          // New slot completely wraps around an existing slot
          startTime: { gte: start },
          endTime: { lte: end },
        }
      ],
    },
  });

  // 2. If overlap found, stop here and throw an error
  if (overlap) {
    throw new Error("This time slot overlaps with an existing availability.");
  }

  // 3. If clear, proceed with your working create logic
  return await prisma.availability.create({
    data: {
      startTime: start,
      endTime: end,
      isBooked: false,
      tutor: {
        connect: { id: cleanId }
      }
    }
  });
};

// Get Availability by ID
export const getAvailabilityById = async (id: string) => {
  return prisma.availability.findUnique({
    where: { id },
    include: { tutor: true, booking: true }
  });
};

// Get all Availabilities
export const getAllAvailabilities = async () => {
  return prisma.availability.findMany({
    include: { tutor: true, booking: true }
  });
};

// Update Availability
export const updateAvailability = async (
  id: string,
  data: Partial<{ startTime: Date; endTime: Date; isBooked: boolean }>
) => {
  return prisma.availability.update({
    where: { id },
    data
  });
};

// Delete Availability
export const deleteAvailability = async (id: string) => {
  return prisma.availability.delete({
    where: { id }
  });
};

export const availabilityService = {
  createAvailability,
  getAvailabilityById,
  getAllAvailabilities,
  updateAvailability,
  deleteAvailability
};
