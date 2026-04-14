export interface IPagination {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}

export type TPaginatedResponse<T> = {
  data: T[];
  meta: IPagination;
};

export type TSortDirection = "asc" | "desc";

export type TOrderBy<T extends string> = {
  [key in `orderBy${T}`]?: boolean;
} & {
  [key in `orderBy${T}Direction`]?: TSortDirection;
};
