// services/availabilityService.ts
import { prisma } from "../lib/prisma";
export const createAvailability = async (data: { 
  tutorId: string; 
  startTime: string; 
  endTime: string; 
}) => {
  const cleanId = data.tutorId.replace(/[^a-zA-Z0-9-]/g, '');
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  // 1. Basic Validation
  if (start >= end) {
    throw new Error("End time must be after start time.");
  }

  // 2. Find the profile
  const profile = await prisma.tutorProfile.findFirst({
    where: {
      OR: [{ id: cleanId }, { userId: cleanId }]
    }
  });

  if (!profile) throw new Error(`Tutor profile not found.`);

  // 3. Check for Overlapping Slots
  const existingOverlap = await prisma.availability.findFirst({
    where: {
      tutorId: profile.id,
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
          // New slot completely covers an existing slot
          startTime: { gte: start },
          endTime: { lte: end },
        },
      ],
    },
  });

  if (existingOverlap) {
    throw new Error("This time slot overlaps with an existing availability.");
  }

  // 4. Create the record if no overlap is found
  return await prisma.availability.create({
    data: {
      startTime: start,
      endTime: end,
      isBooked: false,
      tutorId: profile.id
    }
  });
};
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
