import * as yup from "yup";

export const signupSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .required("First name is required"),

  lastName: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .required("Last name is required"),

  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .required("Password is required"),
});
