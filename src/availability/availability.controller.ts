// controllers/availabilityController.ts
import { Request, Response } from "express";
import { availabilityService } from "../availability/availability.service";

// Create Availability
export const createAvailabilityController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const availability = await availabilityService.createAvailability(data);
    res.status(201).json(availability);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Availability by ID
export const getAvailabilityByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const availability = await availabilityService.getAvailabilityById(id);
    if (!availability) return res.status(404).json({ message: "Availability not found" });
    res.json(availability);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Availabilities
export const getAllAvailabilitiesController = async (_req: Request, res: Response) => {
  try {
    const availabilities = await availabilityService.getAllAvailabilities();
    res.json(availabilities);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Availability
export const updateAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const data = req.body;
    const updated = await availabilityService.updateAvailability(id, data);
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Availability
export const deleteAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await availabilityService.deleteAvailability(id);
    res.json(deleted);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
