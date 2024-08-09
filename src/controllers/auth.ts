import type { Request, Response } from "express";
import * as yup from "yup";
import {
  createAccountSchema,
  loginSchema,
} from "../validations/auth.validation";
import { prismaInstance } from "../utils/prisma";
import { StatusCode } from "../enums/statusEnum";
import { comparePasswords, hashPassword } from "../utils/hashPassword";
import { signJwt } from "../utils/jwt";

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
    } = req.body;
    const user = await prismaInstance.users.findUnique({
      where: { phoneNumber },
    });

    const hashedPassword = await hashPassword(password);
    if (!user) {
      await prismaInstance.users.create({
        data: {
          username,
          phoneNumber,
          password: hashedPassword,
          gender,
          withdrawPassword,
        },
      });
      return res.status(StatusCode.Created).json({
        message: "Account created successfully",
        data: {
          username,
          phoneNumber,
          gender,
        },
        token: signJwt({
          id: user?.id,
          username,
        }),
      });
    }
    return res.status(StatusCode.BadRequest).json({
      message: "User already exists",
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else {
      console.log(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    await loginSchema.validate(req.body);
    const { phoneNumber, password } = req.body;

    const isUser = await prismaInstance.users.findFirst({
      where: {
        phoneNumber,
      },
    });
    //@ts-ignore
    const isPasswordCorrect = await comparePasswords(password, isUser.password);
    console.log(isPasswordCorrect);
    if (!isUser) {
      return res.status(StatusCode.NotFound).json({
        message: "User not found",
      });
    }

    if (!isPasswordCorrect) {
      return res.status(StatusCode.BadRequest).json({
        message: "Invalid credentials",
      });
    }

    return res.status(StatusCode.OK).json({
      message: "Logged in successfully",
      data: {
        username: isUser.username,
        email: isUser.email,
        phoneNumber: isUser.phoneNumber,
      },
      token: {
        token: signJwt({
          id: isUser.id,
          username: isUser.username,
        }),
      },
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else {
      console.log(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};

export { createAccountController, loginController };
