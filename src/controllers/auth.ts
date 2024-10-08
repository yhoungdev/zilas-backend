import type { Request, Response } from "express";
import * as yup from "yup";
import {
  createAccountSchema,
  loginSchema,
} from "../../validations/auth.validation";
import { prismaInstance } from "../../utils/prisma";
import { StatusCode } from "../enums/statusEnum";
import { comparePasswords, hashPassword } from "../../utils/hashPassword";
import { signJwt } from "../../utils/jwt";

const createAccountController = async (req: Request, res: Response) => {
  try {
    await createAccountSchema.validate(req.body);
    const {
      username,
      phoneNumber,
      withdrawPassword,
      password,
      gender,
      invitationCode,
      email,
    } = req.body;

    const referalCode = `ZIL${username.toUpperCase()}`;

    const existingUser = await prismaInstance.users.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return res.status(StatusCode.BadRequest).json({
        message: "User with this phone number already exists",
      });
    }

    const existingEmail = await prismaInstance.users.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(StatusCode.BadRequest).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prismaInstance.users.create({
      data: {
        username,
        phoneNumber,
        email,
        password: hashedPassword,
        gender,
        withdrawPassword,
        userRank: "VIP1",
        status: "PENDING",
        referalCode: referalCode,
        Wallet: {
          create: {},
        },
      },
      include: {
        Wallet: true,
      },
    });

    const token = signJwt({
      id: newUser.id,
      username: newUser.username,
    });

    return res.status(StatusCode.Created).json({
      message: "Account created successfully",
      data: {
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        gender: newUser.gender,
        userRank: newUser.userRank,
        status: newUser.status,
        wallet: newUser.Wallet,
      },
      token,
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      res.status(StatusCode.BadRequest).json({
        message: "Validation failed",
        errors: err.errors,
      });
      //@ts-ignore
    } else if (err?.code === "P2002") {
      res.status(StatusCode.Conflict).json({
        //@ts-ignore
        message: `A user with this ${err?.meta?.target} already exists.`,
      });
    } else {
      console.error("Error in createAccountController:", err);
      res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};


const loginController = async (req: Request, res: Response) => {
  try {
    await loginSchema.validate(req.body);
    const { phoneNumber, password } = req.body;

    const user = await prismaInstance.users.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (!user) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(StatusCode.BadRequest).json({
        message: "Invalid credentials",
      });
    }

    const token = signJwt({
      id: user.id,
      username: user.username,
    });

    return res.status(StatusCode.OK).json({
      message: "Logged in successfully",
      data: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userRank: user.userRank,
      },
      token,
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      res.status(StatusCode.BadRequest).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else {
      console.error("Error in loginController:", err);
      res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};

export { createAccountController, loginController };
