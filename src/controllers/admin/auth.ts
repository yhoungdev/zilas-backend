import type { Request, Response } from "express";
import * as yup from "yup";
import { prismaInstance } from "../../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";
import { signJwt } from "../../../utils/jwt";
import { comparePasswords, hashPassword } from "../../../utils/hashPassword";

const createAdminSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const loginAdminSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const createAdminController = async (req: Request, res: Response) => {
  try {
    await createAdminSchema.validate(req.body);
    const { email, password } = req.body;

    const existingAdmin = await prismaInstance.admins.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(StatusCode.BadRequest).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await prismaInstance.admins.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = signJwt({
      id: newAdmin.id,
      email: newAdmin.email,
    });

    return res.status(StatusCode.Created).json({
      message: "Admin created successfully",
      data: {
        email: newAdmin.email,
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
      console.error("Error in createAdminController:", err);
      res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};

const loginAdminController = async (req: Request, res: Response) => {
  try {
    await loginAdminSchema.validate(req.body);
    const { email, password } = req.body;

    const admin = await prismaInstance.admins.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(StatusCode.NotFound).json({
        message: "Admin not found",
      });
    }

    const isPasswordCorrect = await comparePasswords(password, admin.password);

    if (!isPasswordCorrect) {
      return res.status(StatusCode.BadRequest).json({
        message: "Invalid credentials",
      });
    }

    const token = signJwt({
      id: admin.id,
      email: admin.email,
    });

    return res.status(StatusCode.OK).json({
      message: "Logged in successfully",
      data: {
        email: admin.email,
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
      console.error("Error in loginAdminController:", err);
      res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};

export { createAdminController, loginAdminController };
