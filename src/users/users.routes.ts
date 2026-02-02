import { Router } from "express";
import {
  getUserByIdController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  updateUserStatusController
} from "../users/users.controller";
import auth, { UserRole } from "../middlewares/auth";
const router = Router();

// Routes
router.get("/", getAllUsersController);       // Get all users
router.get("/:id", getUserByIdController);    // Get user by ID
router.delete("/:id", deleteUserController);  // Delete user
// ADMIN
router.get("/admin/users", getAllUsersController);       // Get all users

router.patch(
  "admin/users/:id",
  auth(UserRole.ADMIN),
  updateUserStatusController
);
// STUDENT
router.patch("/:id", updateUserController);   // Partially update user

export default router;
