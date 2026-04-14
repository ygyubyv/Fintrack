import { useNotification } from "./useNotification";
import axiosInstance from "@/plugins/axios.plugin";
import axios from "axios";

interface Props {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  payload?: unknown;
  headers?: Record<string, string>;
  responseType?: "json" | "blob" | "text" | "arraybuffer";
  params?: Record<string, unknown>;

  successMessage?: string;
}

export const useApi = () => {
  const { notify } = useNotification();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isError = computed(() => {
    return !!error.value;
  });

  const $api = async <T>({
    method = "GET",
    url,
    payload,
    headers,
    responseType = "json",
    successMessage,
    params,
  }: Props) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await axiosInstance<T>({
        method,
        url,
        headers,
        params,
        data: payload,
        responseType,
      });

      if (successMessage) {
        notify({
          message: successMessage,
          type: "success",
        });
      }

      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        error.value = e.response?.data?.message || e.message;
      } else if (e instanceof Error) {
        error.value = e.message;
      }

      notify({
        message: error.value || "Something went wrong",
        type: "error",
      });

      console.error(e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    isError,
    $api,
  };
};
