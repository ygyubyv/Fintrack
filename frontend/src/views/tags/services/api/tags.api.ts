export const TagsApi = {
  getAllTags: "/tags",
  createTag: "/tags",
  getTagById: (id: number) => `/tags/${id}`,
  updateTag: (id: number) => `/tags/${id}`,
  deleteTag: (id: number) => `/tags/${id}`,
};
