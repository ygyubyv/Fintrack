import { Tag } from "../../generated/prisma/client";
import { TTagResponseDto } from "./types/tag.types";

export const toTagResponse = (tag: Tag): TTagResponseDto => ({
  id: tag.id,
  title: tag.title,
  color: tag.color,
  createdAt: tag.createdAt,
  updatedAt: tag.updatedAt,
});
