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

    const user = await prismaInstance.users.findUnique(telephone);
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
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};

export { createAccountController, loginController };
