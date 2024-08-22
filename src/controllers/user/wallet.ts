import type { Request, Response } from "express";
import { prismaInstance } from "../../../utils/prisma";
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
    const existingWallet = await prismaInstance.externalWallet.findUnique({
      where: {
        userId: id,
      },
    });

    if (existingWallet) {
      return res.status(400).json({
        message:
          "You have already linked a wallet to this network. Please contact support if you need assistance.",
      });
    }

    const addWallet = await prismaInstance.externalWallet.create({
      data: {
        address,
        network,
        user: {
          connect: {
            id,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Wallet details sent successfully",
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

    const wallet = userWallet.Wallet;
    if (wallet) {
      const now = new Date();
      const lastUpdated = wallet.updatedAt;

      const hoursSinceLastUpdate =
        (now.getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastUpdate >= 24) {
        await prismaInstance.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: wallet.balance + wallet.todaysEarning,
            todaysEarning: 0,
            updatedAt: now,
          },
        });
      }
    }

    return res.status(200).json({
      message: "User wallet details",
      wallet: userWallet.Wallet,
      resetCount: userWallet.resetCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      //@ts-ignore
      error: error.message,
    });
  }
};
