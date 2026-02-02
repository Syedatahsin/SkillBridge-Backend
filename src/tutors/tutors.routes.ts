// routes/tutorProfileRoutes.ts
import { Router } from "express";
import {
  createTutorProfileController,
  getTutorProfileByIdController,
  getAllTutorProfilesController,
  updateTutorProfileController,
  deleteTutorProfileController,
  updateTutorFeatureController
} from "./tutors.controller";
import auth, { UserRole } from "../middlewares/auth";

const router = Router();

router.post("/", createTutorProfileController);        
router.get("/", getAllTutorProfilesController);        
router.get("/:id", getTutorProfileByIdController);    
router.put("/:id", updateTutorProfileController);      
router.delete("/:id", deleteTutorProfileController);  
// ADMIN
router.patch(
  "admin/users/:id",
  auth(UserRole.ADMIN),
  updateTutorFeatureController
);

export default router;

