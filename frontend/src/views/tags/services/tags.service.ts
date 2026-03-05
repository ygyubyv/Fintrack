import axiosInstance from "@/plugins/axios.plugin";
import { TagsApi } from "./api/tags.api";
import type { ICreateTag, IUpdateTag } from "../types";
import { ref } from "vue";

export const TagsService = () => {
  const createTag = (successFn?: () => void) => {
    const isLoading = ref(false);

    const createTagHandler = async (payload: ICreateTag) => {
      try {
        isLoading.value = true;
        await axiosInstance.post(TagsApi.createTag, payload);

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, createTagHandler };
  };

  const updateTag = (successFn?: () => void) => {
    const isLoading = ref(false);

    const updateTagHandler = async (id: number, payload: IUpdateTag) => {
      try {
        isLoading.value = true;
        await axiosInstance.patch(TagsApi.updateTag(id), payload);

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, updateTagHandler };
  };

  const deleteTag = (successFn?: () => void) => {
    const isLoading = ref(false);

    const deleteTagHandler = async (id: number) => {
      try {
        isLoading.value = true;
        await axiosInstance.delete(TagsApi.deleteTag(id));

        successFn?.();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    return { isLoading, deleteTagHandler };
  };

  return {
    createTag,
    updateTag,
    deleteTag,
  };
};
