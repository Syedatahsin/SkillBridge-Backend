// routes/reviewRoutes.ts
import { Router } from "express";
import {
  createReviewController,
  getAllReviewsController,
  updateReviewController,
  deleteReviewController,
  getReviewStats,
  getReviewStatsHandler
} from "../reviews/reviews.controller";

const router = Router();

router.get("/", getAllReviewsController);        // Get all
router.post("/", createReviewController);      // Create
router.put("/:id", updateReviewController);      // Update
router.delete("/:id", deleteReviewController);   // Delete
// STUDENT
    // Create
// TUTOR
router.get("/:id", getReviewStatsHandler );     // Get by ID
router.get("/stats/:tutorId", getReviewStats);
export default router;
