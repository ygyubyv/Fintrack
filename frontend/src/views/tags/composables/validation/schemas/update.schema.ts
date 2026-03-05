import * as yup from "yup";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const updateTagSchema = yup.object({
  title: yup
    .string()
    .min(1)
    .max(50, "Title must be at most 50 characters")
    .optional(),

  color: yup
    .string()
    .matches(hexColorRegex, "Color must be a valid HEX color")
    .optional(),
});
