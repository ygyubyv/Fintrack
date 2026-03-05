export const CategoriesApi = {
  getAllCategories: "/categories",
  createCategory: "/categories",
  getCategoryById: (id: number) => `/categories/${id}`,
  updateCategory: (id: number) => `/categories/${id}`,
  deleteCategory: (id: number) => `/categories/${id}`,
};
