import { Router } from "express";
import {
  getUserByIdController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  updateUserStatusController
} from "../users/users.controller";
import auth, { UserRole } from "../middlewares/auth";
import { toggleTutorBanStatus } from "../users/users.controller";
import { updateUser } from "./users.controller";

const userrouter = Router();

// 1. STATIC ROUTES (No parameters like :id)
userrouter.get("/", getAllUsersController);
userrouter.post("/update-status", toggleTutorBanStatus); 

// 2. SPECIFIC DYNAMIC ROUTES (Must be ABOVE the generic /:id)
// This ensures "update" isn't treated as a user "id"
userrouter.patch('/update/:id', updateUser); 

// 3. GENERIC PARAMETER ROUTES (The "Catch-alls")
userrouter.get("/:id", getUserByIdController);
userrouter.delete("/:id", deleteUserController);

// NOTE: You have updateUserController twice. 
// Use the generic one only for internal/admin updates if needed.
userrouter.patch("/:id", updateUserController); 

export default userrouter;