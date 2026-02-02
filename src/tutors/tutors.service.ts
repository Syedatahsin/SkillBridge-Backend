// services/tutorProfileService.ts
import { prisma } from "../lib/prisma";

// Create TutorProfile
export const createTutorProfile = async (data: {
  userId: string;
  bio: string;
  experience: number;
  pricePerHour: number;
  categoryIds: string[]; // must provide array of category IDs
}) => {
  const tutorProfile = await prisma.tutorProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        create: data.categoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } }
        }))
      }
    },
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: true
    }
  });

  return tutorProfile;
};

// Get TutorProfile by ID
export const getTutorProfileById = async (id: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: true
    }
  });
};

// Get all TutorProfiles
export const getAllTutorProfiles = async () => {
  return prisma.tutorProfile.findMany({
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: true
    }
  });
};

// Update TutorProfile
export const updateTutorFeatureService = async (
  userId: string,
  isFeatured: boolean
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  return prisma.tutorProfile.update({
    where: { userId },
    data: {
      isFeatured,
    },
  });
};


export const updateTutorProfile = async (
  id: string,
  data: {
    bio?: string;
    experience?: number;
    pricePerHour?: number;
    categoryIds?: string[];
  }
) => {
  const updateData: any = {
    bio: data.bio,
    experience: data.experience,
    pricePerHour: data.pricePerHour
  };

  if (data.categoryIds) {
    // Remove old categories and create new links
    updateData.categories = {
      deleteMany: {},
      create: data.categoryIds.map((categoryId) => ({
        category: { connect: { id: categoryId } }
      }))
    };
  }

  return prisma.tutorProfile.update({
    where: { id },
    data: updateData,
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: true
    }
  });
};

// Delete TutorProfile
export const deleteTutorProfile = async (id: string) => {
  return prisma.tutorProfile.delete({
    where: { id }
  });
};

export const tutorProfileService = {
  createTutorProfile,
  getTutorProfileById,
  getAllTutorProfiles,
  updateTutorProfile,
  deleteTutorProfile,updateTutorFeatureService
};
