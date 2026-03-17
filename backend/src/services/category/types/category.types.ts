import { IPaginationPayload, TOrderBy } from "../../../types/v1";

export interface ICreateCategoryPayload {
  title: string;
}

export interface IUpdateCategoryPayload {
  title?: string;
}

export type TCategoryOrderByFields = "CreatedAt";

export type TGetAllCategoriesFilters = IPaginationPayload &
  TOrderBy<TCategoryOrderByFields> & {
    title?: string;
    categoryIds?: number[];
  };

export interface IGetCategoryByIdFilters {
  id: number;
}
