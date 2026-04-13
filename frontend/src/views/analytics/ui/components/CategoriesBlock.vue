<script setup lang="ts">
import { CURRENCY } from "@/constants";
import type { IExpense } from "@/views/transactions/types";
import CategoriesChart from "./charts/CategoriesChart.vue";

interface Props {
  items: IExpense[];
}

const props = defineProps<Props>();

const topCategories = computed(() => {
  const map: Record<string, number> = {};

  for (const expense of props.items) {
    if (expense.expenseType !== "EXPENSE") {
      continue;
    }

    const categoryName = expense.category?.title || "Other";
    const amount = Number(expense.value || 0);

    if (!map[categoryName]) {
      map[categoryName] = 0;
    }

    map[categoryName] += amount;
  }

  return Object.entries(map)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
});

const chartData = computed(() => {
  const labels = topCategories.value.map((category) => {
    return category.name;
  });

  const values = topCategories.value.map((category) => {
    return category.total;
  });

  return {
    labels,
    values,
  };
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- Categories -->
    <div class="bg-white rounded-2xl shadow-sm p-4">
      <h3 class="text-lg font-semibold mb-4">Top Categories</h3>

      <div v-if="topCategories.length" class="space-y-3">
        <div
          v-for="category in topCategories"
          :key="category.name"
          class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 transition"
        >
          <div class="flex items-center gap-2 min-w-0">
            <!-- Dot -->
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: '#6366F1' }"
            ></div>

            <!-- Name -->
            <span class="text-sm text-gray-800 truncate">
              {{ category.name }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Amount -->
            <span class="text-sm font-medium text-gray-900">
              {{ category.total.toFixed(2) }} {{ CURRENCY }}
            </span>

            <!-- % -->
            <span class="text-xs text-gray-400 w-10 text-right">
              {{
                (
                  (category.total /
                    topCategories.reduce((acc, c) => acc + c.total, 0)) *
                  100
                ).toFixed(0)
              }}%
            </span>
          </div>
        </div>
      </div>

      <div v-else class="text-sm text-gray-400">No data</div>
    </div>

    <!-- Chart -->
    <div
      class="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center"
    >
      <div class="w-full max-w-75">
        <CategoriesChart
          :data="{ labels: chartData.labels, values: chartData.values }"
        />
      </div>
    </div>
  </div>
</template>
