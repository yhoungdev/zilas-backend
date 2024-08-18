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

export const changePasswordSchema = yup.object().shape({
  userId: yup.string().required("User ID is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("New password is required"),
});