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
      bankAccountNumber: data.bankAccountNumber, // Ensure this field is included in the create data  
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        }
      },
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: {            
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            }
          },
        }
      }
    }
  });
};

export const findTutorIdByUserId = async (userId: string) => {
  // We only select the 'id' field (the tutorId) for performance
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: userId },
    select: { id: true },
  });

  return profile;
};



export const getFeaturedTutors = async (page: number, limit: number) => {
  const queryOptions: any = {
    where: {
      isFeatured: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        }
      },
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  };

  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }

  const [data, totalCount] = await Promise.all([
    prisma.tutorProfile.findMany(queryOptions),
    prisma.tutorProfile.count({ where: { isFeatured: true } }),
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



export const getAllTutorProfiles = async (page: number, limit: number) => {
  // Use a dynamic query object
  const queryOptions: any = {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        }
      },
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        }
      },
      categories: { include: { category: true } },
      availability: true,
      bookings: true,
      reviews: true
    }
  });
};
export const updateFeaturedStatus = async (id: string, isFeatured: boolean) => {
  return await prisma.tutorProfile.update({
    where: { id: id },
    data: {
      isFeatured: isFeatured,
    },
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
  page = 1,
  limit = 10
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

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const queryOptions: any = {
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        }
      },
      categories: { include: { category: true } },
      reviews: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  };

  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }

  let tutors = await prisma.tutorProfile.findMany(queryOptions);
  let totalCount = await prisma.tutorProfile.count({ where });

  // Filter by minRating if provided (Note: Rating filtering in DB is complex with nested reviews, 
  // currently done in memory which affects pagination accuracy if many are filtered out)
  if (typeof minRating === "number" && minRating > 0) {
    tutors = tutors.filter((tutor) => {
      const avgRating = tutor.reviews.length > 0
        ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / tutor.reviews.length
        : 0;
      return avgRating >= minRating;
    });
    // In-memory filtering means totalCount and lastPage might be slightly off for the consumer
  }

  return {
    data: tutors,
    meta: {
      total: totalCount,
      page: page,
      limit: limit,
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1,
    },
  };
};


export const tutorProfileService = {
  createTutorProfile,
  getTutorProfileById,
  getAllTutorProfiles,
  updateTutorProfile,
  deleteTutorProfile,updateTutorFeatureService,
    getAllsearchTutors,getFeaturedTutors,findTutorIdByUserId // Make sure this matches the name used in controller

};
