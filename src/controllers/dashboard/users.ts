import type { Request, Response } from "express";
import { prismaInstance } from "../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";

export const listAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await prismaInstance.users.findMany({
      omit: {
        password: true,
      },
    });
    res.status(StatusCode.OK).json({
      message: "Users fetched successfully",
      data: users,
      count: users?.length,
    });
  } catch (err) {
    res.status(StatusCode.InternalServerError).json({
      message: err?.message,
      error: "Internal Server Error",
    });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prismaInstance.users.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }
    res.status(StatusCode.OK).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(StatusCode.InternalServerError).json({
      message: err?.message,
      error: "Internal Server Error",
    });
  }
};

export const createUserController = async (req: Request, res: Response) => {};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUser = await prismaInstance.users.update({
      where: { id },
      data: req.body,
    });
    if (!updatedUser) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }
    res.status(StatusCode.OK).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  const { status, id } = req.body;
  try {
    const user = await prismaInstance.users.update({
      where: { id },
      data: { status: status === true ? "VERIFIED" : "PENDING" },
    });

    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    return res.status(StatusCode.OK).json({
      message: `User status has been update to ${status === true ? "verified" : "pending"} successfully`,
      data: {
        status: status === true ? "VERIFIED" : "PENDING",
      },
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prismaInstance.users.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    const deleteuser = await prismaInstance.users.delete({
      where: { id },
    });
    if (!deleteuser)
      return res
        .status(StatusCode.NotFound)
        .json({ message: "Failed to delete user" });

    return res.status(StatusCode.OK).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};
