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
