import type { Request, Response } from "express";
import { prismaInstance } from "../../utils/prisma";
import type { IExtendJwtPayload } from "../../types";

export const addExternalWalletController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { address, network } = req.body;
    const { id } = req?.user as IExtendJwtPayload;

    if (!address || !network) {
      return res.status(400).json({
        message: "Address and network are required",
      });
    }

    const addWallet = await prismaInstance.externalWallet.create({
      //@ts-ignore
      data: { id, address, network },
    });

    if (!addWallet) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    return res.status(201).json({
      message: " Wallet  details sent successfully",
      wallet: addWallet,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      //@ts-ignore
      error: err.message,
    });
  }
};

export const getUserWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req?.user as IExtendJwtPayload;

    if (!id) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const userWallet = await prismaInstance.users.findUnique({
      where: { id },
      include: {
        Wallet: true,
      },
    });

    if (!userWallet) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User wallet details",
      wallet: userWallet.Wallet,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      //@ts-ignore
      error: error.message,
    });
  }
};
