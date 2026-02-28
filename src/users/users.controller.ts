import { Request, Response } from "express";
import { updateUserStatusService, userService } from "../users/users.service";
import { prisma } from "../lib/prisma";

export const toggleTutorBanStatus = async (req: Request, res: Response) => {
  try {
    const targetId = req.body.id || req.body.userId;
    const { status } = req.body;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const isBanned = status === "BANNED";

    // Call the service function we just defined
    const updatedUser = await userService.updateUserBanStatus(targetId, isBanned);

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: updatedUser
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};






export const updateUserStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be ACTIVE or BANNED",
      });
    }

    const user = await updateUserStatusService(id as string, status);

    res.status(200).json({
      success: true,
      message: `User ${status === "BANNED" ? "banned" : "unbanned"} successfully`,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

if (!id || Array.isArray(id)) {
  return res.status(400).json({ message: "Invalid user ID" });
}


    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  // 1. Force ID to be a string to satisfy the Prisma 'where' type
  const id = req.params.id as string;
  const { name } = req.body;

  // 2. Add a quick guard check
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid User ID provided" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { 
        id: id // Now TS knows this is strictly a string
      },
      data: { 
        name,
      },
    });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Failed to update user identity" });
  }
};

 export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    // Only extracting limit as requested
    const limit = Number(req.query.limit) || 0;

    // Passing limit to the service (defaulting page to 1)
    const result = await userService.getAllUsers(1, limit);

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

// Update user
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!id || Array.isArray(id)) {
  return res.status(400).json({ message: "Invalid user ID" });
}



    const updatedUser = await userService.updateUser(id, data);
    res.json(updatedUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
  return res.status(400).json({ message: "Invalid user ID" });}
    const deletedUser = await userService.deleteUser(id);
    res.json(deletedUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
