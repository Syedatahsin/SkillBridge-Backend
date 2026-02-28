// controllers/reviewController.ts
import { Request, Response, NextFunction } from "express";
import { ReviewServicee, reviewService } from "../reviews/reviews.service";

// Get Review Stats
export const getReviewStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tutorId } = req.params;
    const data = await ReviewServicee.getTutorReviewStats(tutorId as any);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Create Review
export const createReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const review = await reviewService.createReview(data);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// Get Review by ID
export const getReviewByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const review = await reviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    next(error);
  }
};

// Get all Reviews
export const getAllReviewsController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Update Review
export const updateReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const data = req.body;
    const updated = await reviewService.updateReview(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete Review
export const deleteReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const deleted = await reviewService.deleteReview(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};