import * as yup from "yup";

export const createProductSchema = yup.object({
  name: yup.string().required(),
  price: yup.number().required(),
  image: yup.mixed().required(),
});

export const updateProductSchema = yup.object({
  name: yup.string().optional(),
  price: yup.number().optional(),
  image: yup.mixed().optional(),
});
