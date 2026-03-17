import { IPaginationPayload, TOrderBy } from "../../../types/v1";

export interface ICreateTagPayload {
  title: string;
  color: string;
}

export interface IUpdateTagPayload {
  title?: string;
  color?: string;
}

export type TTagOrderByFields = "CreatedAt";

export type TGetAllTagsFilters = IPaginationPayload &
  TOrderBy<TTagOrderByFields> & {
    title?: string;
    tagIds?: number[];
  };

export interface IGetTagByIdFilters {
  id: number;
}
