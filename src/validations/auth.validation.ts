import * as yup from "yup";

const createAccountSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  telephone: yup
    .string()
    .matches(/^\d{10}$/, "Telephone must be exactly 10 digits")
    .required("Telephone is required"),
  withdrawPassword: yup.string().required("Withdraw Password is required"),
  loginPassword: yup.string().required("Login Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("loginPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
  gender: yup.string().required("Gender is required"),
  invitationCode: yup.string().required("Invitation Code is required"),
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export { loginSchema, createAccountSchema };
