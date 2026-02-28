// routes/reviewRoutes.ts
import { Router } from "express";
import {
  createReviewController,
  getReviewByIdController,
  getAllReviewsController,
  updateReviewController,
  deleteReviewController,
  getReviewStats
} from "../reviews/reviews.controller";

const router = Router();

router.get("/", getAllReviewsController);        // Get all
router.post("/", createReviewController);      // Create
router.get("/:id", getReviewByIdController);     // Get by ID
router.put("/:id", updateReviewController);      // Update
router.delete("/:id", deleteReviewController);   // Delete
// STUDENT
    // Create
// TUTOR
router.get("/:id", getReviewByIdController);     // Get by ID
router.get("/stats/:tutorId", getReviewStats);
export default router;
