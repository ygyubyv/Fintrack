import { useApi } from "@/composables/useApi";
import { baseURL } from "@/plugins/axios.plugin";
import type { TPaginatedResponse } from "@/types";
import type { IExpense } from "@/views/transactions/types";
import { watchDebounced } from "@vueuse/core";
import { computed, reactive, ref } from "vue";
import { ExpensesApi } from "@/views/transactions/services/api/expenses.api";

export const usePaginatedList = () => {
  const { $api, isLoading } = useApi();

  const DEBOUNCE = ref(0); // ms

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
      immediate: false,
      debounce: DEBOUNCE.value,
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
