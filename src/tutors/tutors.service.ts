// services/tutorProfileService.ts
import { get } from "node:http";
import { TutorProfileWhereInput } from "../generated/prisma/models";
import { prisma } from "../lib/prisma";

export const createTutorProfile = async (data: any) => {
  return await prisma.tutorProfile.create({
    data: {
      userId: data.userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      // This is the link to the middle table
      categories: {
        create: data.categoryIds.map((id: string) => ({
          categoryId: id // This refers to the field in the TutorCategory model
        }))
      }
    }
  });
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
      reviews: {            // 1st Level: Get the reviews for this tutor
        include: {
          student: true,    // 2nd Level: Get the student details for EACH review
        }




    }
  }});
};

export const findTutorIdByUserId = async (userId: string) => {
  // We only select the 'id' field (the tutorId) for performance
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: userId },
    select: { id: true },
  });

  return profile;
};



export const getFeaturedTutors = async () => {
  // findMany always returns an array (empty [] or full)
  return await prisma.tutorProfile.findMany({
    where: {
      isFeatured: true,
    },
    include: {
      user: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
  });
};



export const getAllTutorProfiles = async (page: number, limit: number) => {
  // Use a dynamic query object
  const queryOptions: any = {
    include: {
      user: true,
      categories: { include: { category: true } },
      availability: true,
      reviews: true,
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

  // Execute queries
  const [data, totalCount] = await Promise.all([
    prisma.tutorProfile.findMany(queryOptions),
    prisma.tutorProfile.count(),
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

// Update TutorProfile
export const updateTutorFeatureService = async (
  userId: string,
  isFeatured:boolean
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

// tutors.service.ts
// ... existing imports (prisma, etc)

export const getAllsearchTutors = async ({
  search,
  categories = [],
  minPrice,
  maxPrice,
  minRating,
}: any) => {
  const andConditions: any[] = [];

  if (search && search.trim() !== "") {
    andConditions.push({
      OR: [
        { bio: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ],
    });
  }

  if (Array.isArray(categories) && categories.length > 0) {
    andConditions.push({
      categories: {
        some: {
          category: {
            name: { in: categories },
          },
        },
      },
    });
  }

  if (typeof minPrice === "number" && !isNaN(minPrice)) {
    andConditions.push({ pricePerHour: { gte: minPrice } });
  }
  if (typeof maxPrice === "number" && !isNaN(maxPrice)) {
    andConditions.push({ pricePerHour: { lte: maxPrice } });
  }

  const tutors = await prisma.tutorProfile.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : {},
    include: {
      user: true,
      categories: { include: { category: true } },
      reviews: true,
    },
  });

  if (typeof minRating === "number" && minRating > 0) {
    return tutors.filter((tutor) => {
      const avgRating = tutor.reviews.length > 0
        ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / tutor.reviews.length
        : 0;
      return avgRating >= minRating;
    });
  }

  return tutors;
};


export const tutorProfileService = {
  createTutorProfile,
  getTutorProfileById,
  getAllTutorProfiles,
  updateTutorProfile,
  deleteTutorProfile,updateTutorFeatureService,
    getAllsearchTutors,getFeaturedTutors,findTutorIdByUserId // Make sure this matches the name used in controller

};
