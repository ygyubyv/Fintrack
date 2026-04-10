<script setup lang="ts">
import BasePagination from "@/components/base/BasePagination.vue";
import BaseOverlay from "@/components/base/BaseOverlay.vue";
import { computed, ref } from "vue";
import { usePaginatedList } from "@/composables/usePaginatedList";
import type { IExpense, IUpdateExpense } from "../types";
import { ExpensesApi } from "../services/api/expenses.api";
import TransactionsList from "./components/list/TransactionsList.vue";
import FiltersBlock from "./components/FiltersBlock.vue";
import CreateExpense from "./components/drawer/CreateExpense.vue";
import { ExpensesService } from "../services/expenses.service";
import BaseConfirmDialog from "@/components/base/BaseConfirmDialog.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import UpdateExpense from "./components/drawer/UpdateExpense.vue";
import ShowExpenseDetailsDialog from "./components/dialog/ShowExpenseDetailsDialog.vue";
import ImportExpenses from "./components/dialog/ImportExpenses.vue";

const {
  page,
  perPage,
  lastPage,
  items,
  isLoading: expensesIsLoading,
  paginationData,
  searchQueryParams,
  resetFilters,
  refresh,
} = usePaginatedList<IExpense>(ExpensesApi.getAllExpenses);

const {
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
  importExpenses,
} = ExpensesService();
const { isLoading: createExpenseIsLoading, createExpenseHandler } =
  createExpense(refresh);
const { isLoading: updateExpenseIsLoading, updateExpenseHandler } =
  updateExpense(refresh);
const { isLoading: deleteExpenseIsLoading, deleteExpenseHandler } =
  deleteExpense(refresh);
const { isLoading: exportExpensesIsLoading, exportExpensesHandler } =
  exportExpenses();
const { isLoading: importExpensesIsLoading, importExpensesHandler } =
  importExpenses(refresh);

const expenseDetailsDialogIsVisible = ref(false);
const createExpenseDrawerIsVisible = ref(false);
const updateExpenseDrawerIsVisible = ref(false);
const deleteExpenseDrawerIsVisible = ref(false);
const importExpensesDialogIsVisible = ref(false);

const selectedExpense = ref<IExpense | null>(null);

const isLoading = computed(() => {
  return (
    expensesIsLoading.value ||
    createExpenseIsLoading.value ||
    updateExpenseIsLoading.value ||
    deleteExpenseIsLoading.value ||
    exportExpensesIsLoading.value ||
    importExpensesIsLoading.value
  );
});

const onExpenseDetails = (expense: IExpense) => {
  selectedExpense.value = expense;
  expenseDetailsDialogIsVisible.value = true;
};

const onUpdateExpense = (expense: IExpense) => {
  selectedExpense.value = expense;
  updateExpenseDrawerIsVisible.value = true;
};

const onDeleteExpense = (expense: IExpense) => {
  selectedExpense.value = expense;
  deleteExpenseDrawerIsVisible.value = true;
};

const handleUpdateExpense = (payload: IUpdateExpense) => {
  updateExpenseHandler(selectedExpense.value!.id, payload);
};

const handleDeleteExpense = () => {
  deleteExpenseHandler(selectedExpense.value!.id);
};
</script>

<template>
  <section class="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm">
    <BaseOverlay v-show="isLoading" />

    <!-- Expense Details -->
    <ShowExpenseDetailsDialog
      v-if="selectedExpense"
      v-model:dialog-is-visible="expenseDetailsDialogIsVisible"
      :expense="selectedExpense"
    />

    <!-- Create Expense -->
    <CreateExpense
      v-model:drawer-is-visible="createExpenseDrawerIsVisible"
      @submit="createExpenseHandler"
    />

    <!-- Update Expense -->
    <UpdateExpense
      v-if="selectedExpense"
      :expense="selectedExpense"
      v-model:drawer-is-visible="updateExpenseDrawerIsVisible"
      @submit="handleUpdateExpense"
    />

    <!-- Delete Expense -->
    <BaseConfirmDialog
      v-model="deleteExpenseDrawerIsVisible"
      cancel-text="Cancel"
      confirm-text="Confirm"
      message="Are you sure you want to delete this expense?"
      title="Delete Expense"
      @confirm="handleDeleteExpense"
    />

    <!-- Import Expenses -->
    <ImportExpenses
      v-model:dialog-is-visible="importExpensesDialogIsVisible"
      @submit="importExpensesHandler"
    />

    <div>
      <h2 class="text-2xl font-semibold text-neutral-900">Transactions</h2>
    </div>

    <!-- Filters header -->
    <FiltersBlock
      :search-query-params="searchQueryParams"
      @add-new-expense="createExpenseDrawerIsVisible = true"
      @reset-filters="resetFilters"
      @export="exportExpensesHandler"
      @import="importExpensesDialogIsVisible = true"
    />

    <!-- Content -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div
        v-if="!expensesIsLoading && !items.length"
        class="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
        <div
          class="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-400"
        >
          <font-awesome-icon :icon="['fas', 'inbox']" />
        </div>

        <div class="text-sm font-medium text-gray-900">No transactions yet</div>

        <div class="text-xs text-gray-500 mt-1">
          Start by adding your first expense
        </div>

        <div class="mt-4">
          <BaseButton
            text="New"
            icon="plus"
            mode="Primary"
            :onClick="() => (createExpenseDrawerIsVisible = true)"
          />
        </div>
      </div>

      <!-- List -->
      <TransactionsList
        v-else
        :items="items"
        @details="onExpenseDetails"
        @delete="onDeleteExpense"
        @update="onUpdateExpense"
      />
    </div>

    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 text-sm"
      >
        <div>{{ paginationData }}</div>
        <label class="flex items-center gap-2">
          Per page:
          <select
            v-model="perPage"
            class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          >
            <option :value="5">5</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </label>
      </div>

      <BasePagination :total-pages="lastPage" v-model="page" />
    </div>
  </section>
</template>
