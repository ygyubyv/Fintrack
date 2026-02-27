export interface IPaginationPayload {
  page: number;
  perPage: number;
}

export type TSortDirection = "asc" | "desc";

export type TOrderBy<T extends string> = {
  [key in `orderBy${T}`]?: boolean;
} & {
  [key in `orderBy${T}Direction`]?: TSortDirection;
};
