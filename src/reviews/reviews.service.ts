// services/reviewService.ts
import { prisma } from "../lib/prisma";

// Create Review
export const createReview = async (data: {
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment?: string;
}) => {
  const review = await prisma.review.create({
    data
  });
  return review;
};

// Get Review by ID
export const getReviewById = async (id: string) => {
  return prisma.review.findUnique({
    where: { id },
    include: {
      student: true,
      tutor: true,
      booking: true
    }
  });
};

// Get all Reviews
export const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      student: true,
      tutor: true,
      booking: true
    }
  });
};

// Update Review
export const updateReview = async (
  id: string,
  data: Partial<{ rating: number; comment?: string }>
) => {
  return prisma.review.update({
    where: { id },
    data
  });
};

// Delete Review
export const deleteReview = async (id: string) => {
  return prisma.review.delete({
    where: { id }
  });
};

export const reviewService = {
  createReview,
  getReviewById,
  getAllReviews,
  updateReview,
  deleteReview
};
