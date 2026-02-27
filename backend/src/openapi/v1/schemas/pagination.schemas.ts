export const PaginationMetaSchema = {
  type: "object",
  required: ["currentPage", "lastPage", "perPage", "total"],
  properties: {
    currentPage: { type: "integer", minimum: 1, example: 1 },
    lastPage: { type: "integer", minimum: 1, example: 5 },
    perPage: { type: "integer", minimum: 1, maximum: 100, example: 10 },
    total: { type: "integer", minimum: 0, example: 42 },
  },
};
