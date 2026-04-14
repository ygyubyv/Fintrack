import type { TOrderBy } from "@/types";

export interface ITag {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTag {
  title: string;
  color: string;
}

export interface IUpdateTag {
  title?: string;
  color?: string;
}

export interface IImportTags {
  file: File;
}

export type TTagsOrderByFields = "CreatedAt";

export type TGetAllTagsFilters = TOrderBy<TTagsOrderByFields> & {
  title: string;
};
