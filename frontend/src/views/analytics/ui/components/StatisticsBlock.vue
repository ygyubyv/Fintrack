<script setup lang="ts">
import { CURRENCY } from "@/constants";
import type { IExpense } from "@/views/transactions/types";

interface Props {
  items: IExpense[];
}

interface IStatistics {
  totalExpense: number;
  totalIncome: number;
  averageExpense: number;
  biggestExpense: number;
}

const props = defineProps<Props>();

const statisticsData = computed((): IStatistics => {
  // Utils
  const expenses = props.items.filter((item) => {
    return item.expenseType === "EXPENSE";
  });

  const incomes = props.items.filter((item) => {
    return item.expenseType === "INCOME";
  });

  // Data
  const totalExpense = expenses.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.value);
  }, 0);

  const totalIncome = incomes.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.value);
  }, 0);

  const averageExpense = expenses.length ? totalExpense / expenses.length : 0;

  const biggestExpense = expenses.length
    ? Math.max(...expenses.map((expense) => Number(expense.value)))
    : 0;

  return {
    totalExpense,
    totalIncome,
    averageExpense,
    biggestExpense,
  };
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Expense -->
    <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 text-red-500"
      >
        <font-awesome-icon icon="arrow-down" />
      </div>
      <div>
        <p class="text-sm text-gray-500">Total Expense</p>
        <p class="text-xl font-bold text-gray-900">
          {{ statisticsData.totalExpense.toFixed(2) }} {{ CURRENCY }}
        </p>
      </div>
    </div>

    <!-- Total Income -->
    <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-green-500"
      >
        <font-awesome-icon icon="arrow-up" />
      </div>
      <div>
        <p class="text-sm text-gray-500">Total Income</p>
        <p class="text-xl font-bold text-gray-900">
          {{ statisticsData.totalIncome.toFixed(2) }} {{ CURRENCY }}
        </p>
      </div>
    </div>

    <!-- Average Expense -->
    <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-500"
      >
        <font-awesome-icon icon="chart-line" />
      </div>
      <div>
        <p class="text-sm text-gray-500">Average Expense</p>
        <p class="text-xl font-bold text-gray-900">
          {{ statisticsData.averageExpense.toFixed(2) }} {{ CURRENCY }}
        </p>
      </div>
    </div>

    <!-- Biggest Expense -->
    <div class="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
      <div
        class="w-12 h-12 flex items-center justify-center rounded-xl bg-yellow-100 text-yellow-500"
      >
        <font-awesome-icon icon="bolt" />
      </div>
      <div>
        <p class="text-sm text-gray-500">Biggest Expense</p>
        <p class="text-xl font-bold text-gray-900">
          {{ statisticsData.biggestExpense.toFixed(2) }} {{ CURRENCY }}
        </p>
      </div>
    </div>
  </div>
</template>
