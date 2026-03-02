import { Category } from "../../generated/prisma/client";
import { TCategoryResponseDto } from "./types/category.types";

export const toCategoryResponse = (
  category: Category,
): TCategoryResponseDto => ({
  id: category.id,
  title: category.title,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});
