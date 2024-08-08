import type { Request, Response } from "express";
import * as yup from "yup";
import {
  createAccountSchema,
  loginSchema,
} from "../validations/auth.validation";
import bcrypt from "bcrypt";
import { prismaInstance } from "../utils/prisma";
import { StatusCode } from "../enums/statusEnum";

const createAccountController = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    await createAccountSchema.validate(req.body);
    const {
      username,
      telephone,
      withdrawPassword,
      password,
      gender,
      invitationCode,
    } = req.body;

    const user = await prismaInstance.users.findUnique({
      where: { telephone },
    });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prismaInstance.users.create({
        data: {
          username,
          telephone,
          password: hashedPassword,
          gender,
          withdrawPassword,
        },
      });
      return res.status(StatusCode.Created).json({
        message: "Account created successfully",
        data: {
          username,
          telephone,
          gender,
        },
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
    const { telephone, password } = req.body;

    const isUser = await prismaInstance.users.findFirst({
      where: {
        telephone,
      },
    });
    //@ts-ignore
    const isPasswordCorrect = await bcrypt.compare(password, isUser.password);
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
        telephone: isUser.telephone,
      },
      token: {
        token: "",
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
