// routes/tutorProfileRoutes.ts
import { Router } from "express";
import { toggleFeaturedTutor } from "./tutors.controller";
import {
  createTutorProfileController,
  getTutorProfileByIdController,
  updateTutorProfileController,
  deleteTutorProfileController,
  updateTutorFeatureController,
  getFeaturedTutorsController,getTutorIdHandler
} from "./tutors.controller";
import auth, { UserRole } from "../middlewares/auth";
import { getAllsearchTutors } from "./tutors.controller";
import { getAllTutorsController } from "./tutors.controller";

const router = Router();

router.post("/", createTutorProfileController);        
router.get("/alltutor", getAllTutorsController);        
router.put("/:id", updateTutorProfileController);      
router.delete("/:id", deleteTutorProfileController);  
// ADMIN
router.patch(
  "admin/users/:id",
  
  updateTutorFeatureController
);
// PUBLIC
router.get("/public/getSEARCHtutors", getAllsearchTutors);
router.get("/public/featured", getFeaturedTutorsController);
router.patch("/feature/:id", toggleFeaturedTutor);
router.get("/tutorid/:userId", getTutorIdHandler);        

router.get("/public/:id", getTutorProfileByIdController);    
// TUTOR
router.post("/teacher/createprofile",createTutorProfileController);  
router.patch("/update/:id", updateTutorProfileController);

export default router;

