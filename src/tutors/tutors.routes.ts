// routes/tutorProfileRoutes.ts
import { Router } from "express";
import {
  createTutorProfileController,
  getTutorProfileByIdController,
  getAllTutorProfilesController,
  updateTutorProfileController,
  deleteTutorProfileController,
  updateTutorFeatureController,
  getFeaturedTutorsController
} from "./tutors.controller";
import auth, { UserRole } from "../middlewares/auth";
import { getAllsearchTutors } from "./tutors.service";

const router = Router();

router.post("/", createTutorProfileController);        
router.get("/", getAllTutorProfilesController);        
router.put("/:id", updateTutorProfileController);      
router.delete("/:id", deleteTutorProfileController);  
// ADMIN
router.patch(
  "admin/users/:id",
  auth(UserRole.ADMIN),
  updateTutorFeatureController
);
// PUBLIC
router.get("/api/public/getSEARCHtutors", getAllsearchTutors);
router.get("/api/public/:id", getTutorProfileByIdController);    
router.get("/api/public/featured", getFeaturedTutorsController);
// TUTOR
router.post("/", createTutorProfileController);  
router.put("/:id", updateTutorProfileController);      


export default router;

