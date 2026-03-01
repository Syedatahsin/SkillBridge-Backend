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

const categoryrouter = Router();

categoryrouter.get("/get", getAllCategoriesController);      // Get all categories
categoryrouter.get("/:id", getCategoryByIdController);    // Get category by ID
categoryrouter.delete("/:id",deleteCategoryController);  // Delete category
// ADMIN
categoryrouter.post("/admin/categories",  createCategoryController);        // Create category
categoryrouter.put("/admin/categories/:id",updateCategoryController);     // Update category

export default categoryrouter;
