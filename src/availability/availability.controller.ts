// controllers/availabilityController.ts
import { Request, Response, NextFunction } from "express";
import { availabilityService } from "../availability/availability.service";

export const createAvailabilityController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Log the data to see what the backend is actually receiving
    console.log("Backend receiving:", data);

    const availability = await availabilityService.createAvailability(data);
    
    return res.status(201).json({
      success: true,
      data: availability
    });
  } catch (error: any) {
    console.error("PRISMA CRASH:", error);
    
    // FORCE JSON RESPONSE
    return res.status(400).json({ 
      success: false, 
      message: error.message || "Database operation failed" 
    });
  }
};

// Get Availability by ID
export const getAvailabilityByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const availability = await availabilityService.getAvailabilityById(id);
    if (!availability) return res.status(404).json({ message: "Availability not found" });
    
    res.json(availability);
  } catch (error) {
    next(error);
  }
};

// Get all Availabilities
export const getAllAvailabilitiesController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const availabilities = await availabilityService.getAllAvailabilities();
    res.json(availabilities);
  } catch (error) {
    next(error);
  }
};

// Update Availability
export const updateAvailabilityController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const data = req.body;
    const updated = await availabilityService.updateAvailability(id, data);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete Availability
export const deleteAvailabilityController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const deleted = await availabilityService.deleteAvailability(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};