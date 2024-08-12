import type { Request, Response } from "express";
import { prismaInstance } from "../../../utils/prisma";
import { StatusCode } from "../../enums/statusEnum";
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
