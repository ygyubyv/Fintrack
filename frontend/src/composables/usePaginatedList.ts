import { baseURL } from "@/plugins/axios.plugin";
import type { TPaginatedResponse } from "@/types";
import { useApi } from "./useApi";

interface IPaginatedListOptions {
  changeUrl: boolean;
}

export const usePaginatedList = <
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends Record<string, any> = Record<string, never>,
>(
  apiUrl: string,
  options: Partial<IPaginatedListOptions> = {},
) => {
  const { changeUrl = true } = options;

  const router = useRouter();
  const route = useRoute();

  const { $api, isLoading } = useApi();

  const page = ref(route.query.page ? Number(route.query.page) : 1);
  const perPage = ref(route.query.perPage ? Number(route.query.perPage) : 15);

  const DEBOUNCE = 100; // ms

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

  const searchQueryParams = reactive({} as F);

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
        if (key === "page" || key === "perPage") {
          return;
        }

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

  const updateSearchQueryParam = <K extends keyof F>(key: K, value: F[K]) => {
    (searchQueryParams as F)[key] = value;
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
      if (changeUrl) {
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
      }
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
    updateSearchQueryParam,
  };
};
