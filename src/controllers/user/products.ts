import type { Request, Response } from "express";
import { prismaInstance } from "../../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";
import { IExtendJwtPayload } from "../../types";
import { calculateProfit } from "../../helper/calculateProfit";

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

export const fetchSingleProductById = async (req: Request, res: Response) => {
  const { id: userId } = req.user as IExtendJwtPayload;

  try {
    const user = await prismaInstance.users.findUnique({
      where: { id: userId },
    });

    const rank = user?.userRank;

    if (!user) {
      return res.status(StatusCode.Unauthorized).json({
        message: "User not found",
      });
    }

    const { id } = req.params;
    const product = await prismaInstance.products.findUnique({
      where: { id },
    });

    const price = Number(product?.price);

    const productProfit = calculateProfit({
      rank,
      price,
    });

    if (!product) {
      return res.status(StatusCode.NotFound).json({
        message: "Product not found",
      });
    }

    return res.status(StatusCode.OK).json({
      message: "Product fetched successfully",
      data: {
        ...product,
        profit: productProfit,
      },
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
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

    const profit = calculateProfit({
      price: 2,
      rank,
    });

    if (productCount === 0) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "Invalid user rank" });
    }

    const products = await prismaInstance.products.findMany({
      take: productCount,
    });

    const minted = await prismaInstance.mintOfTheDay.findMany({});
    const mapMinted = minted?.map((data) => {
      return data?.productId;
    });

    const filteredProducts = products
      .filter((product) => !mapMinted?.includes(product.id))
      .map((product) => ({
        ...product,
        profit,
      }));

    return res.status(StatusCode.OK).json({
      message: `Products count for ${user.userRank}`,
      data: filteredProducts,
      detail: "Filtered products based on counts ",
      count: filteredProducts.length,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      //@ts-ignore
      message: err?.message,
      error: "Internal Server Error",
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

export const submitPendingHistroyController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { recordId } = req.params;

    if (!recordId) {
      return res
        .status(StatusCode.BadRequest)
        .json({ message: "Record  ID is required" });
    }

    const checkProduct = await prismaInstance.usersHistory.findUnique({
      where: { id: recordId },
    });

    if (!checkProduct) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "Product not found" });
    }

    const updateProduct = await prismaInstance.usersHistory.update({
      where: { id: recordId },
      data: {
        status: "completed",
      },
    });

    return res
      .status(StatusCode.OK)
      .json({ message: "Product updated successfully", data: updateProduct });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal Server",
      //@ts-ignore
      error: err?.message,
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

    const profit = calculateProfit({
      rank: user.userRank,
      price: getPrice,
    });

    const userHistory = await prismaInstance.usersHistory.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (submit) {
      if (userHistory && userHistory.status === "completed") {
        return res.status(StatusCode.OK).json({
          message: "Product has already been submitted, balance not updated",
          data: product,
        });
      }

      if (userHistory && userHistory.status === "pending") {
        await prismaInstance.wallet.update({
          where: { userId },
          data: {
            balance: wallet.balance + getPrice,
            frozenBalance: wallet.frozenBalance - getPrice,
            todaysEarning: wallet.todaysEarning + getPrice,
            totalProfit: wallet.totalProfit + profit,
          },
        });

        await prismaInstance.usersHistory.update({
          where: { id: userHistory.id },
          data: { status: "completed" },
        });
      } else {
        await prismaInstance.wallet.update({
          where: { userId },
          data: {
            balance: wallet.balance - getPrice,
            todaysEarning: wallet.todaysEarning + getPrice,
            totalProfit: wallet.totalProfit + profit,
          },
        });

        await prismaInstance.usersHistory.create({
          data: {
            userId,
            productId,
            status: "completed",
            quantity: 1,
            hasFrozenBalanceUpdated: false,
          },
        });
      }

      await prismaInstance.mintOfTheDay.create({
        data: {
          userId,
          productId,
        },
      });
    } else {
      if (userHistory && userHistory.hasFrozenBalanceUpdated) {
        return res.status(StatusCode.OK).json({
          message: "Product has already been viewed, balance not updated",
          data: product,
        });
      }

      if (wallet.balance < getPrice) {
        return res.status(StatusCode.BadRequest).json({
          message: "Insufficient balance",
        });
      }

      await prismaInstance.wallet.update({
        where: { userId },
        data: {
          balance: wallet.balance - getPrice,
          frozenBalance: wallet.frozenBalance + getPrice,
        },
      });

      if (userHistory) {
        await prismaInstance.usersHistory.update({
          where: { id: userHistory.id },
          data: { hasFrozenBalanceUpdated: true, status: "pending" },
        });
      } else {
        await prismaInstance.usersHistory.create({
          data: {
            userId,
            productId,
            status: "pending",
            quantity: 1,
            hasFrozenBalanceUpdated: true,
          },
        });
      }
    }

    return res.status(StatusCode.OK).json({
      message: submit
        ? "Product submitted successfully, wallet balance and profit updated"
        : "Product viewed successfully, frozen balance updated",
      data: product,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      //@ts-ignore
      error: err?.message,
    });
  }
};

