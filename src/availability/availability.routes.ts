// routes/availabilityRoutes.ts
import { Router } from "express";
import {
  createAvailabilityController,
  getAvailabilityByIdController,
  getAllAvailabilitiesController,
  updateAvailabilityController,
  deleteAvailabilityController
} from "../availability/availability.controller";
import auth, { UserRole } from "../middlewares/auth";

const availabilityrouter = Router();
availabilityrouter.get("/", getAllAvailabilitiesController);      // Get all
availabilityrouter.get("/:id", getAvailabilityByIdController);    // Get by ID
availabilityrouter.put("/:id",updateAvailabilityController);     // Update
availabilityrouter.delete("/:id", deleteAvailabilityController);  // Delete
// TUTOR
availabilityrouter.post("/create",createAvailabilityController);
export default availabilityrouter;
