import * as yup from "yup";

export const createCategorySchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(1)
    .max(50, "Title must be at most 50 characters"),
});
