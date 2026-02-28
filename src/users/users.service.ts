// services/userService.ts

import { prisma } from "../lib/prisma";


export const updateUserBanStatus = async (userId: string, isBanned: boolean) => {
  // We use the boolean to decide which string status to save in the DB
  const newStatus = isBanned ? "BANNED" : "ACTIVE";

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: newStatus,
    },
  });
};

// Create a new user
const createUser = async (data: any) => {
  const result = await prisma.user.create({
    data
  });
  return result;
};


export const updateUserStatusService = async (
  userId: string,
  status: "ACTIVE" | "BANNED"
) => {
  // check user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // update status
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      sessions: true,
      accounts: true,
      tutorProfile: true,
      bookingsAsStudent: true,
      reviews: true
    }
  });
  return user;
};

export const getAllUsers = async (page: number, limit: number) => {
  const queryOptions: any = {
    include: {
      sessions: true,
      accounts: true,
      tutorProfile: true,
      bookingsAsStudent: true,
      reviews: true
    },
    orderBy: {
      createdAt: 'desc',
    },
  };

  // Logic: only apply take/skip if limit is provided
  if (limit > 0) {
    queryOptions.take = limit;
    queryOptions.skip = (page - 1) * limit;
  }

  // Promise.all for speed
  const [data, totalCount] = await Promise.all([
    prisma.user.findMany(queryOptions),
    prisma.user.count(),
  ]);

  return {
    data,
    meta: {
      total: totalCount,
      limit: limit,
      // Since you only pass limit, lastPage helps UI know if there's more
      lastPage: limit > 0 ? Math.ceil(totalCount / limit) : 1,
    },
  };
};
const updateUser = async (id: string, data:any) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data
  });
  return updatedUser;
};

// Delete user by ID
const deleteUser = async (id: string) => {
  const deletedUser = await prisma.user.delete({
    where: { id }
  });
  return deletedUser;
};

export const userService = {
  

  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,updateUserBanStatus 
};
