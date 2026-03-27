import { baseURL } from "@/plugins/axios.plugin";
import type { TPaginatedResponse } from "@/types";
import { watchDebounced } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "./useApi";

export const usePaginatedList = <T>(apiUrl: string) => {
  const router = useRouter();
  const { $api, isLoading } = useApi();

  const page = useRouteQuery("page", 1, { transform: Number });
  const perPage = useRouteQuery("perPage", 15, { transform: Number });

  const DEBOUNCE = 300; // ms

  const items = ref<T[]>([]);
  const lastPage = ref(0);
  const total = ref(0);

  const paginationData = computed(() => {
    const firstIndex = items.value.length
      ? (page.value - 1) * perPage.value + 1
      : 0;

    const lastIndex = items.value.length + (page.value - 1) * perPage.value;

    return `Showing ${firstIndex} to ${lastIndex} of ${total.value} entries`;
  });

  const searchQueryParams = reactive<Record<string, unknown>>({});

  const filters = computed((): Record<string, unknown> => {
    return {
      page: page.value,
      perPage: perPage.value,
      ...searchQueryParams,
    };
  });

  const resetFilters = () => {
    for (const key in searchQueryParams) {
      delete searchQueryParams[key];
    }

    router.replace({
      query: {
        page: 1,
        perPage: 15,
      },
    });
  };

  // Sync state with initial query
  const initializeSearchQuery = () => {
    const params = new URL(window.location.href).searchParams;

    params.forEach((value, key) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "page" || key === "perPage") return;

        if (!isNaN(Number(value))) {
          searchQueryParams[key] = Number(value);
        } else {
          searchQueryParams[key] = value;
        }
      }
    });
  };

  const generateSearchParams = (initialUrl: string) => {
    const url = new URL(initialUrl);

    for (const [key, value] of Object.entries(filters.value)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    return String(url);
  };

  const fetchItems = async () => {
    try {
      const { data, meta } = await $api<TPaginatedResponse<T>>({
        url: generateSearchParams(baseURL + apiUrl),
      });

      items.value = data;
      total.value = meta.total;
      lastPage.value = meta.lastPage;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = () => fetchItems();

  // Sync state changes with router query
  watchDebounced(
    searchQueryParams,
    () => {
      router.replace({
        query: {
          page: String(page.value),
          perPage: String(perPage.value),
          ...Object.fromEntries(
            Object.entries(searchQueryParams)
              .filter(
                ([_, value]) =>
                  value !== undefined &&
                  value !== null &&
                  !(typeof value === "string" && value.trim() === ""),
              )
              .map(([key, value]) => [key, String(value)]),
          ),
        },
      });
    },
    {
      debounce: DEBOUNCE,
      deep: true,
    },
  );

  watchDebounced(
    filters,
    (newValue, oldValue) => {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        fetchItems();
      }
    },
    {
      immediate: true,
      debounce: DEBOUNCE,
      deep: true,
    },
  );

  initializeSearchQuery();
  fetchItems();

  return {
    page,
    perPage,
    items,
    isLoading,
    lastPage,
    total,
    paginationData,
    filters,
    searchQueryParams,
    resetFilters,
    fetchItems,
    refresh,
  };
};
