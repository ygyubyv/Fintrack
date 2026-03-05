import * as yup from "yup";

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const createTagSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(1)
    .max(50, "Title must be at most 50 characters"),

  color: yup
    .string()
    .required("Color is required")
    .matches(hexColorRegex, "Color must be a valid HEX color"),
});
