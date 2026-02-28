import { Request, Response, NextFunction } from "express";
import { updateUserStatusService, userService } from "../users/users.service";
import { prisma } from "../lib/prisma";

export const toggleTutorBanStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetId = req.body.id || req.body.userId;
    const { status } = req.body;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const isBanned = status === "BANNED";

    const updatedUser = await userService.updateUserBanStatus(targetId, isBanned);

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const { name } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid User ID provided" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { name },
    });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const result = await userService.getAllUsers(1, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await userService.updateUser(id, data);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const deletedUser = await userService.deleteUser(id);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};