import * as yup from "yup";

export const updateCategorySchema = yup.object({
  title: yup
    .string()
    .min(1)
    .max(50, "Title must be at most 50 characters")
    .optional(),
});
