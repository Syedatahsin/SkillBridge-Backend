import { Request, Response } from "express";
import { updateUserStatusService, userService } from "../users/users.service";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const userData = req.body; // coming from auth provider
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

 export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
