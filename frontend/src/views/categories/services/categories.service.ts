import { CategoriesApi } from "./api/categories.api";
import type { ICreateCategory, IUpdateCategory } from "../types";
import { useApi } from "@/composables/useApi";

export const CategoriesService = () => {
  const createCategory = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const createCategoryHandler = async (payload: ICreateCategory) => {
      try {
        await $api({
          method: "POST",
          url: CategoriesApi.createCategory,
          payload,
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, createCategoryHandler };
  };

  const updateCategory = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const updateCategoryHandler = async (
      id: number,
      payload: IUpdateCategory,
    ) => {
      try {
        await $api({
          method: "PATCH",
          url: CategoriesApi.updateCategory(id),
          payload,
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, updateCategoryHandler };
  };

  const deleteCategory = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const deleteCategoryHandler = async (id: number) => {
      try {
        await $api({
          url: CategoriesApi.deleteCategory(id),
          method: "DELETE",
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, deleteCategoryHandler };
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
