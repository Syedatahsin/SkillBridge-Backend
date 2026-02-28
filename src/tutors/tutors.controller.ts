// controllers/tutorProfileController.ts
import { Request, Response } from "express";
import { getFeaturedTutors, tutorProfileService } from "./tutors.service";



export const getTutorIdHandler = async (req: Request, res: Response) => {
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

    // Returns the UUID of the TutorProfile
    return res.status(200).json({ tutorId: profile.id });
  } catch (error) {
    console.error("Error in getTutorIdHandler:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
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



// tutors.controller.ts
export const getAllsearchTutors = async (req: Request, res: Response) => {
  try {
    console.log("📥 Incoming Search Query:", req.query);

    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    
    // Convert comma-separated string to array
    const categoriesRaw = req.query.categories as string;
    const categories = categoriesRaw 
      ? categoriesRaw.split(",").filter(c => c.trim() !== "") 
      : [];

    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;

    // AWAIT is critical here
    const result = await tutorProfileService.getAllsearchTutors({
      search,
      categories,
      minPrice,
      maxPrice,
      minRating
    });

    console.log(`✅ Found ${result.length} tutors. Sending response...`);
    return res.status(200).json(result); 

  } catch (e: any) {
    console.error("❌ Search Controller Error:", e);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: e.message 
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
export const getFeaturedTutorsController = async (req: Request, res: Response) => {
  try {
    const result = await tutorProfileService.getFeaturedTutors();
    // Always return an array, even if empty, so .map() doesn't crash
    return res.status(200).json(result || []);
  } catch (error: any) {
    console.error("Featured Fetch Error:", error);
    return res.status(500).json({ message: "Failed to fetch featured tutors" });
  }
};


export const getAllTutorsController = async (req: Request, res: Response) => {
  try {
    // 1. Extract from query: e.g., /api/tutors?page=1&limit=10
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 0;

    // 2. Call the service
    const result = await tutorProfileService.getAllTutorProfiles(page, limit);

    // 3. Send structured response
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
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
