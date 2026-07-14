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

export const getReviewById = async (tutorId: string) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { 
        tutorId: tutorId 
      },
      orderBy: { 
        createdAt: "desc" 
      },
      include: {
        student: {
          select: { 
            name: true, 
            image: true 
          }
        }
      }
    });

    return reviews; // Returns the full array of review objects
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Could not fetch reviews");
  }
};

export const ReviewServicee = {
  async getTutorReviewStats(tutorId: string, page: number = 1, limit: number = 2) {
    // 1. Get Average Rating & Total Count
    const stats = await prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const skip = (page - 1) * limit;

    // 2. Get paginated reviews
    const latestReviews = await prisma.review.findMany({
      where: { tutorId },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: { name: true, image: true }
        }
      }
    });

    const totalReviews = stats._count.id;
    const lastPage = Math.ceil(totalReviews / limit);

    return {
      averageRating: stats._avg.rating?.toFixed(1) || "0.0",
      totalReviews,
      latestReviews,
      meta: {
        total: totalReviews,
        page,
        limit,
        lastPage: lastPage > 0 ? lastPage : 1
      }
    };
  }
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
  getAllReviews,
  updateReview,
  deleteReview
};
