import * as yup from "yup";

export const verifyEmailSchema = yup.object({
  code: yup.number().min(100000).max(1000000),
});
