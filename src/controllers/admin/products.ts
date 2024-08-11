import type { Request, Response } from "express";
import * as yup from "yup";
import { prismaInstance } from "../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";
import {
  createProductSchema,
  updateProductSchema,
} from "../../validations/admin";

export const fetchProductsController = async (req: Request, res: Response) => {
  try {
    const products = await prismaInstance.products.findMany();
    return res.status(StatusCode.OK).json({
      message: "Products fetched successfully",
      data: products,
      count: products?.length,
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(StatusCode.BadRequest).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else {
      console.error("Error in fetchProductsController:", err);
      return res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};

export const adminAddProductController = async (
  req: Request,
  res: Response,
) => {
  try {
    await createProductSchema.validate(req.body);
    const { name, price, image } = req.body;
    const base64Image = Buffer.from(image, "binary").toString("base64");
    const newProduct = await prismaInstance.products.create({
      data: {
        name,
        price,
        image: base64Image,
      },
    });

    return res.status(StatusCode.Created).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(StatusCode.BadRequest).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else {
      console.error("Error in adminAddProductController:", err);
      return res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};

export const adminUpdateProductController = async (
  req: Request,
  res: Response,
) => {
  try {
    await updateProductSchema.validate(req.body);

    const { id } = req.params;
    const { name, price, image } = req.body;

    let updateData: any = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (image)
      updateData.image = Buffer.from(image, "binary").toString("base64");

    const updatedProduct = await prismaInstance.products.update({
      where: { id },
      data: updateData,
    });

    return res.status(StatusCode.OK).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(StatusCode.BadRequest).json({
        message: "Validation failed",
        errors: err.errors,
      });
    } else if (err?.code === "P2025") {
      return res.status(StatusCode.NotFound).json({
        message: "Product not found",
      });
    } else {
      console.error("Error in adminUpdateProductController:", err);
      return res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};

export const adminDeleteProductController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    await prismaInstance.products.delete({
      where: { id },
    });

    return res.status(StatusCode.OK).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(StatusCode.NotFound).json({
        message: "Product not found",
      });
    } else {
      console.error("Error in adminDeleteProductController:", err);
      return res.status(StatusCode.InternalServerError).json({
        message: "Internal server error",
      });
    }
  }
};
