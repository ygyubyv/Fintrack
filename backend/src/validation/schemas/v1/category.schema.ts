import { z } from "zod";
import type {
  TGetAllCategoriesFilters,
  IGetCategoryByIdFilters,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from "../../../services/category/types/category.types";
import { TSortDirection } from "../../../types/v1";

export const SortDirectionSchema = z.custom<TSortDirection>(
  (val) => val === "asc" || val === "desc",
);

export const GetAllSchema: z.ZodType<TGetAllCategoriesFilters> = z.object({
  page: z.coerce.number().int().min(1),
  perPage: z.coerce.number().int().min(1).max(100),
  title: z.coerce.string().min(1).max(50).optional(),

  orderByCreatedAt: z.coerce.boolean().optional(),
  orderByCreatedAtDirection: SortDirectionSchema.optional(),
});

export const GetByIdSchema: z.ZodType<IGetCategoryByIdFilters> = z.object({
  id: z.coerce.number().int().min(1).default(1),
});

export const CreateSchema: z.ZodType<ICreateCategoryPayload> = z.object({
  title: z.string().min(1).max(50),
});

export const UpdateSchema: z.ZodType<IUpdateCategoryPayload> = z.object({
  title: z.string().min(1).max(50).optional(),
});
