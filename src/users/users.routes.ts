import { Router } from "express";
import {
  createUserController,
  getUserByIdController,
  getAllUsersController,
  updateUserController,
  deleteUserController
} from "../users/users.controller";
const router = Router();

// Routes
router.post("/", createUserController);       // Create user
router.get("/", getAllUsersController);       // Get all users
router.get("/:id", getUserByIdController);    // Get user by ID
router.put("/:id", updateUserController);     // Update user
router.delete("/:id", deleteUserController);  // Delete user

export default router;
