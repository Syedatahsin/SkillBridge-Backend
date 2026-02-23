// routes/reviewRoutes.ts
import { Router } from "express";
import {
  createReviewController,
  getReviewByIdController,
  getAllReviewsController,
  updateReviewController,
  deleteReviewController
} from "../reviews/reviews.controller";

const router = Router();

router.get("/", getAllReviewsController);        // Get all
router.get("/:id", getReviewByIdController);     // Get by ID
router.put("/:id", updateReviewController);      // Update
router.delete("/:id", deleteReviewController);   // Delete

export default router;
// STUDENT
router.post("/", createReviewController);    
    // Create
// TUTOR
router.get("/:id", getReviewByIdController);     // Get by ID
