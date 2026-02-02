// controllers/reviewController.ts
import { Request, Response } from "express";
import { reviewService } from "../reviews/reviews.service";

// Create Review
export const createReviewController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const review = await reviewService.createReview(data);
    res.status(201).json(review);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Review by ID
export const getReviewByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const review = await reviewService.getReviewById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Reviews
export const getAllReviewsController = async (_req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.json(reviews);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Review
export const updateReviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const data = req.body;
    const updated = await reviewService.updateReview(id, data);
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Review
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await reviewService.deleteReview(id);
    res.json(deleted);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
