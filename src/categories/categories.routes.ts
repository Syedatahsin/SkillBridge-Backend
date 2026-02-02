// routes/categoryRoutes.ts
import { Router } from "express";
import {
  createCategoryController,
  getCategoryByIdController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController
} from "../categories/categories.controller";

const router = Router();

router.post("/", createCategoryController);        // Create category
router.get("/", getAllCategoriesController);      // Get all categories
router.get("/:id", getCategoryByIdController);    // Get category by ID
router.put("/:id", updateCategoryController);     // Update category
router.delete("/:id", deleteCategoryController);  // Delete category

export default router;
