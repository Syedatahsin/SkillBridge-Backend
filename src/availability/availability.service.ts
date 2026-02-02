// services/availabilityService.ts
import { prisma } from "../lib/prisma";

// Create Availability
export const createAvailability = async (data: {
  tutorId: string;
  startTime: Date;
  endTime: Date;
}) => {
  const availability = await prisma.availability.create({
    data
  });
  return availability;
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
