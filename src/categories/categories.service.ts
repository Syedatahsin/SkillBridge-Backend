// services/categoryService.ts
import { prisma } from "../lib/prisma";

// Create a new Category
export const createCategory = async (data: { name: string }) => {
  const category = await prisma.category.create({
    data
  });
  return category;
};

// Get Category by ID
export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      tutors: true
    }
  });
  return category;
};

// Get all Categories
export const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { 
          tutors: true 
        }
      }
    }
  });
};
// Update Category
export const updateCategory = async (id: string, data: Partial<{ name: string }>) => {
  const updated = await prisma.category.update({
    where: { id },
    data
  });
  return updated;
};

// Delete Category
export const deleteCategory = async (id: string) => {
  const deleted = await prisma.category.delete({
    where: { id }
  });
  return deleted;
};

export const categoryService = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory
};
