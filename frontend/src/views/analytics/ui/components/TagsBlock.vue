<script setup lang="ts">
import { CURRENCY } from "@/constants";
import type { IExpense } from "@/views/transactions/types";
import TagsChart from "./charts/TagsChart.vue";

interface Props {
  items: IExpense[];
}

interface TopTag {
  title: string;
  amount: number;
  color: string;
}

const props = defineProps<Props>();

const topTags = computed(() => {
  const map = new Map<string, TopTag>();

  for (const expense of props.items) {
    if (expense.expenseType !== "EXPENSE" || !expense.tags.length) {
      continue;
    }

    for (const tag of expense.tags) {
      const title = tag.title;
      const amount = Number(expense.value || 0);
      const color = tag.color;

      const existing = map.get(title);
      if (existing) {
        existing.amount += amount;
      } else {
        map.set(title, { title, amount, color });
      }
    }
  }

  return [...map.values()]
    .map(({ title, amount, color }) => ({ title, amount, color }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
});

const chartData = computed(() => {
  const labels = topTags.value.map((tag) => {
    return tag.title;
  });

  const values = topTags.value.map((tag) => {
    return tag.amount;
  });

  const colors = topTags.value.map((tag) => {
    return tag.color;
  });

  return {
    labels,
    values,
    colors,
  };
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- Chart -->
    <div
      class="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center"
    >
      <div class="w-full max-w-75">
        <TagsChart
          :data="{
            labels: chartData.labels,
            values: chartData.values,
            colors: chartData.colors,
          }"
        />
      </div>
    </div>

    <!-- Tags -->
    <div class="bg-white rounded-2xl shadow-sm p-4">
      <h3 class="text-lg font-semibold mb-4">Top Categories</h3>

      <div v-if="topTags.length" class="space-y-3">
        <div
          v-for="tag in topTags"
          :key="tag.title"
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
              {{ tag.title }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Amount -->
            <span class="text-sm font-medium text-gray-900">
              {{ tag.amount.toFixed(2) }} {{ CURRENCY }}
            </span>

            <!-- % -->
            <span class="text-xs text-gray-400 w-10 text-right">
              {{
                (
                  (tag.amount / topTags.reduce((acc, c) => acc + c.amount, 0)) *
                  100
                ).toFixed(0)
              }}%
            </span>
          </div>
        </div>
      </div>

      <div v-else class="text-sm text-gray-400">No data</div>
    </div>
  </div>
</template>
