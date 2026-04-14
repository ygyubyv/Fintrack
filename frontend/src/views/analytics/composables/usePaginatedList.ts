import { useApi } from "@/composables/useApi";
import { baseURL } from "@/plugins/axios.plugin";
import type { TPaginatedResponse } from "@/types";
import type { IExpense } from "@/views/transactions/types";
import { ExpensesApi } from "@/views/transactions/services/api/expenses.api";

export const usePaginatedList = () => {
  const { $api, isLoading } = useApi();

  const items = ref<IExpense[]>([]);

  const searchQueryParams = reactive<Record<string, unknown>>({});

  const filters = computed((): Record<string, unknown> => {
    return {
      ...searchQueryParams,
    };
  });

  const resetFilters = () => {
    for (const key in searchQueryParams) {
      delete searchQueryParams[key];
    }
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
      const { data } = await $api<TPaginatedResponse<IExpense>>({
        url: generateSearchParams(baseURL + ExpensesApi.getAllExpenses),
      });

      items.value = data;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const refresh = () => fetchItems();

  watch(
    filters,
    (newValue, oldValue) => {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        fetchItems();
      }
    },
    {
      immediate: false,
      deep: true,
    },
  );

  return {
    items,
    isLoading,
    filters,
    searchQueryParams,
    resetFilters,
    fetchItems,
    refresh,
  };
};
