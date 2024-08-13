import type { Request, Response } from "express";
import { prismaInstance } from "../../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";
import { IExtendJwtPayload } from "../../types";
import { RANKS, ENUM_RANKS } from "../../enums";

export const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prismaInstance.products.findMany();
    return res.status(StatusCode.OK).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      //@ts-ignore
      //@ts-ignore
      message: err?.message,
      error: "Internal Server Error",
    });
  }
};

type IRank = {
  rank: "VIP1";
};

export const fetchProductsByUserRank = async (req: Request, res: Response) => {
  const { id } = req.user as IExtendJwtPayload;

  try {
    const user = await prismaInstance.users.findFirst({ where: { id } });

    if (!user) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "User not found" });
    }

    const rank = user.userRank;
    const productCount = rank
      ? {
          VIP1: 10,
          VIP2: 45,
          VIP3: 50,
          VIP4: 55,
        }[rank] || 0
      : 0;

    if (productCount === 0) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "Invalid user rank" });
    }

    const products = await prismaInstance.products.findMany({
      take: productCount,
    });

    return res.status(StatusCode.OK).json({
      message: `Products count for ${user.userRank}`,
      data: products,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      //@ts-ignore
      message: err?.message,
      error: "Internal Server Error",
    });
  }
};


export const viewProduct = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};

export const mintProduct = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};
