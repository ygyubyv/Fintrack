import * as yup from "yup";

export const resetPasswordSchema = yup.object({
  password: yup.string().required("Password is required"),
  token: yup.string().required("Token is required"),
});
