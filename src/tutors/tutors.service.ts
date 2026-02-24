// services/tutorProfileService.ts
import { get } from "node:http";
import { TutorProfileWhereInput } from "../generated/prisma/models";
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
export const getFeaturedTutors = async () => {
  return prisma.tutorProfile.findMany({
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
}

export const getAllTutorProfiles = async (page: number, limit: number) => {
  // Calculate how many items to bypass
  const skip = (page - 1) * limit;

  // We fetch data and total count at the same time
  const [data, totalCount] = await Promise.all([
    prisma.tutorProfile.findMany({
      take: limit,
      skip: skip,
      include: {
        user: true,
        categories: { include: { category: true } },
        availability: true,
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc', // Ensures consistent ordering
      },
    }),
    prisma.tutorProfile.count(),
  ]);

  return {
    data,
    meta: {
      total: totalCount,
      page: page,
      limit: limit,
      lastPage: Math.ceil(totalCount / limit),
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

export const getAllsearchTutors = async ({
  search,
  categories,
  minPrice,
  maxPrice,
  minRating,
}: {
  search: string | undefined;
  categories: string[] | [];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minRating: number | undefined;
}) => {
  const andConditions: TutorProfileWhereInput[] = [];

  // 🔍 Search (bio or user name)
  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // 📚 Subject / Categories
  if (categories.length > 0) {
    andConditions.push({
      categories: {
        some: {
          category: {
            name: {
              in: categories as string[],
            },
          },
        },
      },
    });
  }
  if (minPrice && maxPrice && minPrice > maxPrice) {
  throw new Error("minPrice cannot be greater than maxPrice");
}


if (typeof minPrice === "number") {
  andConditions.push({
    pricePerHour: {
      gte: minPrice,
    },
  });
}

if (typeof maxPrice === "number") {
  andConditions.push({
    pricePerHour: {
      lte: maxPrice,
    },
  });
}

  const tutors = await prisma.tutorProfile.findMany({
    where: {
      AND: andConditions,
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

  if (typeof minRating === "number") {
    return tutors.filter((tutor) => {
      const avgRating =
        tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
        (tutor.reviews.length || 1);

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
  deleteTutorProfile,updateTutorFeatureService,getAllsearchTutors
};
