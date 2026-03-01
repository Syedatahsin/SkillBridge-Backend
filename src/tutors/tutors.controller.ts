// controllers/tutorProfileController.ts
import { Request, Response, NextFunction } from "express";
import { getFeaturedTutors, tutorProfileService } from "./tutors.service";
import * as tutorService from "./tutors.service";

export const getTutorIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const profile = await tutorProfileService.findTutorIdByUserId(userId as any);

    if (!profile) {
      return res.status(404).json({ 
        message: "No tutor profile found for this user. Please create a profile first." 
      });
    }

    return res.status(200).json({ tutorId: profile.id });
  } catch (error) {
    next(error);
  }
};
export const toggleFeaturedTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // TS sees this as string | string[] | undefined
    const { isFeatured } = req.body;

    // 1. Fix the TS Error by validating the id
    if (!id || typeof id !== "string") {
      return res.status(400).json({ 
        success: false, 
        message: "A valid Tutor ID string is required" 
      });
    }

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({ 
        success: false, 
        message: "isFeatured must be a boolean" 
      });
    }

    // Now 'id' is guaranteed to be a string here
    const updatedTutor = await tutorService.updateFeaturedStatus(id, isFeatured);

    return res.status(200).json({
      success: true,
      message: `Tutor ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: updatedTutor,
    });
  } catch (error: any) {
    console.error("Error in toggleFeaturedTutor:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const createTutorProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const profile = await tutorProfileService.createTutorProfile(data);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateTutorFeatureController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // userId
    const { isFeatured } = req.body;

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    const tutorProfile = await tutorProfileService.updateTutorFeatureService(id as string, isFeatured);

    return res.status(200).json({
      success: true,
      message: `Tutor ${isFeatured ? "featured" : "unfeatured"} successfully`,
      data: tutorProfile,
    });
  } catch (error) {
    next(error);
  }
};

// tutors.controller.ts logic merged below
export const getAllsearchTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    
    const categoriesRaw = req.query.categories as string;
    const categories = categoriesRaw 
      ? categoriesRaw.split(",").filter(c => c.trim() !== "") 
      : [];

    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;

    const result = await tutorProfileService.getAllsearchTutors({
      search,
      categories,
      minPrice,
      maxPrice,
      minRating
    });

    return res.status(200).json(result); 
  } catch (error) {
    next(error);
  }
};

export const getTutorProfileByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const profile = await tutorProfileService.getTutorProfileById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedTutorsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tutorProfileService.getFeaturedTutors();
    return res.status(200).json(result || []);
  } catch (error) {
    next(error);
  }
};

export const getAllTutorsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 0;

    const result = await tutorProfileService.getAllTutorProfiles(page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTutorProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const data = req.body;
    const updated = await tutorProfileService.updateTutorProfile(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTutorProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid profile ID" });
    }

    const deleted = await tutorProfileService.deleteTutorProfile(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};