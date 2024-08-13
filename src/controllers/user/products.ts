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
  const { id: productId } = req.params;
  const { id: userId } = req.user as IExtendJwtPayload;
  const { submit } = req.body as { submit: boolean };

  try {
    const user = await prismaInstance.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(StatusCode.Unauthorized).json({
        message: "User not found",
      });
    }

    const product = await prismaInstance.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(StatusCode.NotFound).json({
        message: "Product not found",
      });
    }

    const getPrice = parseFloat(product.price);

    const wallet = await prismaInstance.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(StatusCode.NotFound).json({
        message: "Wallet not found",
      });
    }

    if (submit) {
      await prismaInstance.wallet.update({
        where: { userId },
        data: {
          todaysEarning: wallet.todaysEarning + getPrice,
        },
      });
    } else {
      await prismaInstance.wallet.update({
        where: { userId },
        data: {
          frozenBalance: wallet.frozenBalance + getPrice,
        },
      });
    }

    await prismaInstance.usersHistory.create({
      data: {
        userId,
        productId,
        status: submit ? "completed" : "pending",
        quantity: 1,
      },
    });

    return res.status(StatusCode.OK).json({
      message: submit
        ? "Product fetched successfully, wallet balance updated"
        : "Product fetched successfully, frozen balance updated",
      data: product,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};

export const usersProductHistory = async (req: Request, res: Response) => {
  const { id: userId } = req.user as IExtendJwtPayload;

  try {
    const history = await prismaInstance.usersHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const historyWithProducts = await Promise.all(
      history.map(async (item) => {
        const product = await prismaInstance.products.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            image: true,
          },
        });

        return {
          id: item.id,
          userId: item.userId,
          status: item.status,
          quantity: item.quantity,
          createdAt: item.createdAt,
          product: {
            name: product?.name,
            price: product?.price,
            image: product?.image,
          },
        };
      }),
    );

    return res.status(StatusCode.OK).json({
      message: "Product history fetched successfully",
      data: historyWithProducts,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
    });
  }
};

