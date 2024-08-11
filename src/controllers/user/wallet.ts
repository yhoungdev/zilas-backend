import type { Request, Response } from "express";
import { prismaInstance } from "../../utils/prisma";

export const addExternalWalletController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { address, network } = req.body;
    console.log(req?.user);

    if (!address || !network) {
      return res.status(400).json({
        message: "Address and network are required",
      });
    }

    const addWallet = await prismaInstance.externalWallet.create({
      data: { address, network },
    });

    if (!addWallet) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      //@ts-ignore
      error: err.message,
    });
  }
};
