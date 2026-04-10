import { TagsApi } from "./api/tags.api";
import type { ICreateTag, IImportTags, IUpdateTag } from "../types";
import { useApi } from "@/composables/useApi";
import { downloadFile } from "@/utils";

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

  const exportTags = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const exportTagsHandler = async () => {
      try {
        const file = await $api<File>({
          url: TagsApi.exportTags,
          method: "POST",
          responseType: "blob",
        });

        downloadFile("Tags.csv", file);

        successFn?.();
      } catch (error) {
        console.error(error);
      }
    };

    return { isLoading, exportTagsHandler };
  };

  const importTags = (successFn?: () => void) => {
    const { isLoading, $api } = useApi();

    const importTagsHandler = async (payload: IImportTags) => {
      try {
        await $api({
          url: TagsApi.importTags,
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

    return { isLoading, importTagsHandler };
  };

  return {
    createTag,
    updateTag,
    deleteTag,
    exportTags,
    importTags,
  };
};
