// routes/availabilityRoutes.ts
import { Router } from "express";
import {
  createAvailabilityController,
  getAvailabilityByIdController,
  getAllAvailabilitiesController,
  updateAvailabilityController,
  deleteAvailabilityController
} from "../availability/availability.controller";

const router = Router();
router.get("/", getAllAvailabilitiesController);      // Get all
router.get("/:id", getAvailabilityByIdController);    // Get by ID
router.put("/:id", updateAvailabilityController);     // Update
router.delete("/:id", deleteAvailabilityController);  // Delete
// TUTOR
router.post("/", createAvailabilityController);        // Create

export default router;
