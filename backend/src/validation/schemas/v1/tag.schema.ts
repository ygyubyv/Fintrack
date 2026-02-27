import { z } from "zod";
import type {
  ICreateTagPayload,
  IUpdateTagPayload,
  TGetAllTagsFilters,
  IGetTagByIdFilters,
} from "../../../services/tag/types/tag.types";
import { TSortDirection } from "../../../types/v1";

export const SortDirectionSchema = z.custom<TSortDirection>(
  (val) => val === "asc" || val === "desc",
);

export const GetAllSchema: z.ZodType<TGetAllTagsFilters> = z.object({
  page: z.coerce.number().int().min(1),
  perPage: z.coerce.number().int().min(1).max(100),
  title: z.coerce.string().optional(),

  orderByCreatedAt: z.coerce.boolean().optional(),
  orderByCreatedAtDirection: SortDirectionSchema.optional(),
});

export const GetByIdSchema: z.ZodType<IGetTagByIdFilters> = z.object({
  id: z.coerce.number().int().min(1).default(1),
});

export const CreateSchema: z.ZodType<ICreateTagPayload> = z.object({
  title: z.string(),
  color: z.string(),
});

export const UpdateSchema: z.ZodType<IUpdateTagPayload> = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
});
