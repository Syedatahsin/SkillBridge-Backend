// routes/categoryRoutes.ts
import { Router } from "express";
import {
  createCategoryController,
  getCategoryByIdController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController
} from "../categories/categories.controller";
import  auth  from "../middlewares/auth";
import { UserRole } from "../middlewares/auth";

const router = Router();

router.get("/", getAllCategoriesController);      // Get all categories
router.get("/:id", getCategoryByIdController);    // Get category by ID
router.delete("/:id", deleteCategoryController);  // Delete category
// ADMIN
router.post("/admin/categories",auth(UserRole.ADMIN), createCategoryController);        // Create category
router.put("/admin/categories/:id",auth(UserRole.ADMIN), updateCategoryController);     // Update category

export default router;
