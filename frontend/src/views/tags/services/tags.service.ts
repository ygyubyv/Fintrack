import { TagsApi } from "./api/tags.api";
import type { ICreateTag, IUpdateTag } from "../types";
import { useApi } from "@/composables/useApi";

export const TagsService = () => {
  const createTag = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const createTagHandler = async (payload: ICreateTag) => {
      try {
        await $api({
          url: TagsApi.createTag,
          method: "POST",
          payload,
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, createTagHandler };
  };

  const updateTag = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const updateTagHandler = async (id: number, payload: IUpdateTag) => {
      try {
        await $api({
          url: TagsApi.updateTag(id),
          method: "PATCH",
          payload,
        });

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, updateTagHandler };
  };

  const deleteTag = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const deleteTagHandler = async (id: number) => {
      try {
        await $api({
          url: TagsApi.deleteTag(id),
          method: "DELETE",
        });

        successFn?.();
      } catch (error) {
        console.error(error);
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
