import type { Request, Response } from "express";
import { prismaInstance } from "../../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";
import { RANK_CONSTANT } from "../../../constant";
import { count } from "console";

export const listAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await prismaInstance.users.findMany({
      include: {
        Wallet: true,
        ExternalWallet: true,
      },
    });
    res.status(StatusCode.OK).json({
      message: "Users fetched successfully",
      data: users,
      count: users?.length,
    });
  } catch (err) {
    res.status(StatusCode.InternalServerError).json({
      //@ts-ignore
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
      //@ts-ignore
      message: err?.message,
      error: "Internal Server Error",
    });
  }
};

export const createUserController = async (req: Request, res: Response) => {};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCode.NotFound).json({
        message: "Id is required",
      });
    }

    const checkUser = await prismaInstance.users.findUnique({ where: { id } });
    if (!checkUser) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

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
      //@ts-ignore
      error: err?.message,
    });
  }
};

export const verifyUserController = async (req: Request, res: Response) => {
  const { status, id } = req.body;
  try {
    const checkUser = await prismaInstance.users.findUnique({
      where: { id },
    });

    if (!checkUser) {
      return res.status(StatusCode.BadRequest).json({
        message: "This user is not found ",
      });
    }
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
      //@ts-ignore
      error: err?.message,
    });
  }
};

export const updateUserRankController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userRank } = req?.body;

    if (!id) {
      return res.status(StatusCode.NotFound).json({
        message: "Id is required",
      });
    }

    if (!userRank) {
      return res.status(StatusCode.NotFound).json({
        message: "user rank is required",
      });
    }

    const rankIsIncluded = RANK_CONSTANT.includes(userRank);

    if (!rankIsIncluded) {
      return res.status(StatusCode.BadRequest).json({
        message:
          "Invalid user rank, rank should be either of this ( VIP1 , VIP2, VIP3, VIP4)",
      });
    }

    const checkUser = await prismaInstance.users.findUnique({
      where: { id },
    });

    if (checkUser?.userRank === userRank) {
      return res.status(StatusCode.BadRequest).json({
        message: "User already has this rank",
      });
    }

    if (!checkUser) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    const updatedUser = await prismaInstance.users.update({
      where: { id },
      data: {
        userRank,
      },
    });
    if (!updatedUser) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }
    res.status(StatusCode.OK).json({
      message: `User  has been updated to ${userRank}`,
      data: {
        username: checkUser.username,
        phoneNumber: checkUser.phoneNumber,
        userRank: userRank,
      },
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      //@ts-ignore
      error: err?.message,
    });
  }
};

export const banUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ban } = req.body as { ban: boolean };

    if (!id) {
      return res.status(StatusCode.NotFound).json({
        message: "User ID is required",
      });
    }

    if (typeof ban !== "boolean") {
      return res.status(StatusCode.BadRequest).json({
        message: "The 'ban' field must be a boolean",
      });
    }

    const checkUser = await prismaInstance.users.findUnique({
      where: { id },
    });

    if (!checkUser) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    if (ban && checkUser.status === "BANNED") {
      return res.status(StatusCode.BadRequest).json({
        message: "User is already banned",
      });
    }

    if (!ban && checkUser.status !== "BANNED") {
      return res.status(StatusCode.BadRequest).json({
        message: "User is not banned, so cannot unban",
      });
    }

    const updatedUser = await prismaInstance.users.update({
      where: { id },
      data: {
        status: ban ? "BANNED" : "VERIFIED",
      },
    });

    if (!updatedUser) {
      return res.status(StatusCode.NotFound).json({
        message: "Failed to update user's status",
      });
    }
    return res.status(StatusCode.OK).json({
      message: `User has been ${ban ? "banned" : "unbanned"} successfully`,
      data: {
        username: checkUser.username,
        phoneNumber: checkUser.phoneNumber,
        status: checkUser.status,
      },
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const adminFundUsersWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, fund } = req.body;

    if (!id) {
      return res.status(StatusCode.BadRequest).json({
        message: "User ID is required",
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(StatusCode.BadRequest).json({
        message: "Amount is required",
      });
    }

    if (typeof fund !== "boolean") {
      return res.status(StatusCode.BadRequest).json({
        message: "Fund flag must be true or false",
      });
    }

    const checkUser = await prismaInstance.users.findUnique({
      where: { id },
      include: { Wallet: true },
    });

    if (!checkUser || !checkUser.Wallet) {
      return res.status(StatusCode.NotFound).json({
        message: checkUser ? "User's wallet not found" : "User not found",
      });
    }

    let updatedBalance: number;

    if (fund) {
      updatedBalance = checkUser.Wallet.balance + amount;
    } else {
      if (checkUser.Wallet.balance < amount) {
        return res.status(StatusCode.BadRequest).json({
          message: "Insufficient funds in the wallet",
        });
      }
      updatedBalance = checkUser.Wallet.balance - amount;
    }

    const updatedWallet = await prismaInstance.wallet.update({
      where: { id: checkUser.Wallet.id },
      data: {
        balance: updatedBalance,
      },
    });

    return res.status(StatusCode.OK).json({
      message: `User wallet ${fund ? "funded" : "debit"} successfully`,
      data: updatedWallet,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prismaInstance.users.findUnique({
      where: { id },
      include: {
        Wallet: true,
      },
    });

    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    if (user.Wallet) {
      await prismaInstance.wallet.delete({
        where: { id: user.Wallet.id },
      });
    }

    // Delete the user
    await prismaInstance.users.delete({
      where: { id },
    });

    return res.status(StatusCode.OK).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      //@ts-ignore
      error: err.message,
    });
  }
};

export const listAllExternalWalletsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const externalWallets = await prismaInstance.externalWallet.findMany();

    return res.status(StatusCode.OK).json({
      message: "List of all external wallets",
      data: externalWallets,
      count: externalWallets.length,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      message: "Internal server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const updateUserResetCountController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const user = await prismaInstance.users.findUnique({ where: { id } });

    if (!user) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "User not found" });
    }
    const updatedUser = await prismaInstance.users.update({
      where: { id },
      data: { resetCount: (user.resetCount ?? 0) + 1 },
    });

    return res.status(StatusCode.OK).json({
      message: "User reset count updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(StatusCode.InternalServerError).json({
      //@ts-ignore
      message: err?.message,
      error: "Internal Server Error",
    });
  }
};
