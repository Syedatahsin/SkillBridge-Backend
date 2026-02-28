// controllers/categoryController.ts
import { Request, Response, NextFunction } from "express";
import { categoryService } from "../categories/categories.service";

// Create Category
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const category = await categoryService.createCategory(data);
    res.status(201).json(category);
  } catch (e) {
    next(e);
  }
};

// Get Category by ID
export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const category = await categoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// Get all Categories
export const getAllCategoriesController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// Update Category
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const data = req.body;
    const updated = await categoryService.updateCategory(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete Category
export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const deleted = await categoryService.deleteCategory(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};