import type { Request, Response } from "express";
import { prismaInstance } from "../../../utils/prisma";
import { IExtendJwtPayload } from "../../types";
import { calculateProfit } from "../../helper/calculateProfit";

export const getUserprofileController = async (req: Request, res: Response) => {
  const { id } = req.user as IExtendJwtPayload;
  try {
    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }
    const user = await prismaInstance.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        phoneNumber: true,
        gender: true,
        status: true,
        userRank: true,
        resetCount: true,
        referalCode: true,
        createdAt: true,
        Wallet: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
