import { baseURL } from "@/plugins/axios.plugin";
import type { TPaginatedResponse } from "@/types";
import { watchDebounced } from "@vueuse/core";
import { computed, reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApi } from "./useApi";

interface IPaginatedListOptions {
  changeUrl: boolean;
}

export const usePaginatedList = <T>(
  apiUrl: string,
  options: Partial<IPaginatedListOptions> = {},
) => {
  const { changeUrl = true } = options;

  const router = useRouter();
  const route = useRoute();

  const { $api, isLoading } = useApi();

  const page = ref(route.query.page ? Number(route.query.page) : 1);
  const perPage = ref(route.query.perPage ? Number(route.query.perPage) : 15);

  const DEBOUNCE = ref(25); // ms

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

    page.value = 1;
    perPage.value = 15;
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
    filters,
    () => {
      changeUrl &&
        router.replace({
          query: {
            ...Object.fromEntries(
              Object.entries(filters.value)
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
      debounce: DEBOUNCE.value,
      deep: true,
    },
  );

  watchDebounced(
    filters,
    (newValue, oldValue) => {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        fetchItems();

        // Initially, we don't want to debounce the fetchItems call, so we set DEBOUNCE to 0. After the first change, we set it to 300ms for subsequent changes.
        DEBOUNCE.value = 300;
      }
    },
    {
      immediate: true,
      debounce: DEBOUNCE.value,
      deep: true,
    },
  );

  initializeSearchQuery();
  // fetchItems();

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
