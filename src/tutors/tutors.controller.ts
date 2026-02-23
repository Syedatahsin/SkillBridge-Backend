// controllers/tutorProfileController.ts
import { Request, Response } from "express";
import { getFeaturedTutors, tutorProfileService } from "./tutors.service";

// Create TutorProfile
export const createTutorProfileController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const profile = await tutorProfileService.createTutorProfile(data);
    res.status(201).json(profile);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const updateTutorFeatureController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params; // userId
  const { isFeatured } = req.body;

  if (typeof isFeatured !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isFeatured must be a boolean",
    });
  }

  try {
    const tutorProfile = await tutorProfileService.updateTutorFeatureService(id as string, isFeatured);

    return res.status(200).json({
      success: true,
      message: `Tutor ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: tutorProfile,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};



export const getAllsearchTutors = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const categories = req.query.categories
      ? (req.query.categories as string).split(",")
      : [];

    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;

    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    const minRating = req.query.minRating
      ? Number(req.query.minRating)
      : undefined;

  

    const result = await tutorProfileService.getAllsearchTutors({
      search,
      categories,
      minPrice,
      maxPrice,
      minRating
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Failed to fetch tutors",
      details: e,
    });
  }
};
// Get TutorProfile by ID
export const getTutorProfileByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const profile = await tutorProfileService.getTutorProfileById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const getFeaturedTutorsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getFeaturedTutors();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch featured tutors",
      error,
    });
  }
};

// Get all TutorProfiles
export const getAllTutorProfilesController = async (_req: Request, res: Response) => {
  try {
    const profiles = await tutorProfileService.getAllTutorProfiles();
    res.json(profiles);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update TutorProfile
export const updateTutorProfileController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const data = req.body;
    const updated = await tutorProfileService.updateTutorProfile(id, data);
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete TutorProfile
export const deleteTutorProfileController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const deleted = await tutorProfileService.deleteTutorProfile(id);
    res.json(deleted);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
