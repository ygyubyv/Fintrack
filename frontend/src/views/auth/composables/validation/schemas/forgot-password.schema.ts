import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
});
