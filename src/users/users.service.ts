// services/userService.ts

import { prisma } from "../lib/prisma";


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

// Get all users (including relations)
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      sessions: true,
      accounts: true,
      tutorProfile: true,
      bookingsAsStudent: true,
      reviews: true
    }
  });
  return users;
};

// Update user by ID
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
  deleteUser
};
