import { CategoriesApi } from "./api/categories.api";
import type {
  ICreateCategory,
  IImportCategories,
  IUpdateCategory,
} from "../types";
import { useApi } from "@/composables/useApi";
import { downloadFile } from "@/utils";

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

  const exportCategories = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const exportCategoriesHandler = async () => {
      try {
        const file = await $api<File>({
          url: CategoriesApi.exportCategories,
          method: "POST",
          responseType: "blob",
        });

        downloadFile("Categories.csv", file);

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, exportCategoriesHandler };
  };

  const importCategories = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const importCategoriesHandler = async (payload: IImportCategories) => {
      try {
        await $api({
          url: CategoriesApi.importCategories,
          method: "POST",
          payload,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, importCategoriesHandler };
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    exportCategories,
    importCategories,
  };
};
