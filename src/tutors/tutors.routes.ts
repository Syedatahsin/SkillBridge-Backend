// routes/tutorProfileRoutes.ts
import { Router } from "express";
import {
  createTutorProfileController,
  getTutorProfileByIdController,
  getAllTutorProfilesController,
  updateTutorProfileController,
  deleteTutorProfileController
} from "../tutors/tutors.controller";

const router = Router();

router.post("/", createTutorProfileController);        // Create profile
router.get("/", getAllTutorProfilesController);        // Get all profiles
router.get("/:id", getTutorProfileByIdController);     // Get profile by ID
router.put("/:id", updateTutorProfileController);      // Update profile
router.delete("/:id", deleteTutorProfileController);   // Delete profile

export default router;
