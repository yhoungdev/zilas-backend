import * as yup from "yup";
const createAccountSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{11}$/, "phoneNumber must be exactly 10 digits")
    .required("phone number is required"),
  withdrawPassword: yup.string().required("Withdraw Password is required"),
  password: yup.string().required("Login Password is required"),
  gender: yup.string().required("Gender is required"),
  invitationCode: yup.string().optional(),
});

const loginSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^\d{11}$/, "phoneNumber must be exactly 10 digits")
    .required("phoneNumber is required"),
  password: yup.string().required("Password is required"),
});

export { loginSchema, createAccountSchema };
