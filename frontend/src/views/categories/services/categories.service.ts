import axiosInstance from "@/plugins/axios.plugin";
import { CategoriesApi } from "./api/categories.api";
import type { ICreateCategory, IUpdateCategory } from "../types";
import { ref } from "vue";

export const CategoriesService = () => {
  const createCategory = (successFn?: () => void) => {
    const isLoading = ref(false);

    const createCategoryHandler = async (payload: ICreateCategory) => {
      try {
        isLoading.value = true;
        await axiosInstance.post(CategoriesApi.createCategory, payload);

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, createCategoryHandler };
  };

  const updateCategory = (successFn?: () => void) => {
    const isLoading = ref(false);

    const updateCategoryHandler = async (
      id: number,
      payload: IUpdateCategory,
    ) => {
      try {
        isLoading.value = true;
        await axiosInstance.patch(CategoriesApi.updateCategory(id), payload);

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, updateCategoryHandler };
  };

  const deleteCategory = (successFn?: () => void) => {
    const isLoading = ref(false);

    const deleteCategoryHandler = async (id: number) => {
      try {
        isLoading.value = true;
        await axiosInstance.delete(CategoriesApi.deleteCategory(id));

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
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
