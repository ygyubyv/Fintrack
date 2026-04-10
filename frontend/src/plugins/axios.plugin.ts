import axios from "axios";
import { API_URL, API_PREFIX } from "@/config";
import { useAuthStore } from "@/stores/auth/auth.store";
import camelcaseKeys from "camelcase-keys";
import { storeToRefs } from "pinia";

export const baseURL = `${API_URL}/${API_PREFIX}`;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const authStore = useAuthStore();
  const { refresh, isExpired } = authStore;
  const { accessToken, tokenIsRefreshing } = storeToRefs(authStore);

  if (accessToken.value) {
    if (isExpired(accessToken.value)) {
      if (!tokenIsRefreshing.value) {
        await refresh();
      }
    }

    config.headers.Authorization = `Bearer ${accessToken.value}`;
  }

  if (config.params && typeof config.params === "object") {
    Object.keys(config.params).forEach((key) => {
      const value = config.params[key];

      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete config.params[key];
      }
    });
  }

  if (config.headers["Content-Type"] === "multipart/form-data") {
    const formData = new FormData();

    for (const key in config.data) {
      if (config.data.hasOwnProperty(key)) {
        formData.append(key, config.data[key]);
      }
    }
    config.data = formData;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.headers["content-type"] === "application/json"
    )
      response.data = camelcaseKeys(response.data);

    return response;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
