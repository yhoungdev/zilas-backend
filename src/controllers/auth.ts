import type { Request, Response } from "express";
import * as yup from "yup";
import {
  createAccountSchema,
  loginSchema,
} from "../validations/auth.validation";
import bcrypt from "bcrypt";

const createAccountController  = async (req: Request, res: Response) => {
  try {
    await createAccountSchema.validate(req.body, { abortEarly: false });

    const { firstName, lastName, email, phoneNumber } = req.body;

    const newAccount = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    res.status(201).json({
      message: "Account created successfully",
      account: newAccount,
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

const loginController  = async (req: Request, res: Response) => {
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
