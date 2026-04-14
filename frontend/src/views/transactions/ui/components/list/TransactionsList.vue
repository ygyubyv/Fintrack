<script setup lang="ts">
import { CURRENCY } from "@/constants";
import type { IExpense } from "../../../types";

interface Props {
  items: IExpense[];
}

interface Emits {
  (e: "details", item: IExpense): void;
  (e: "update", item: IExpense): void;
  (e: "delete", item: IExpense): void;
}

defineProps<Props>();

const emit = defineEmits<Emits>();

const formatValue = (expense: IExpense) => {
  const sign = expense.expenseType === "EXPENSE" ? "-" : "+";
  return `${sign} ${expense.value} ${CURRENCY}`;
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      v-for="expense in items"
      :key="expense.id"
      class="group flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white hover:shadow-sm hover:border-gray-300 transition cursor-pointer"
      @click="emit('details', expense)"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-black"
        >
          <font-awesome-icon :icon="['fas', 'wallet']" />
        </div>

        <div class="flex flex-col min-w-0">
          <!-- Title -->
          <div class="text-sm font-semibold text-gray-900 truncate">
            {{
              expense.description || expense.category?.title || "Transaction"
            }}
          </div>

          <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <!-- Category -->
            <span class="px-2 py-0.5 rounded bg-gray-100">
              {{ expense.category?.title ?? "Uncategorized" }}
            </span>

            <!-- Payment Type -->
            <span class="text-gray-400"> • {{ expense.paymentType }} </span>
          </div>

          <!-- Tags -->
          <div v-if="expense.tags.length" class="flex gap-1 mt-1 flex-wrap">
            <span
              v-for="tag in expense.tags"
              :key="tag.id"
              class="text-[10px] px-2 py-0.5 rounded-full border font-medium"
              :style="{
                backgroundColor: tag.color + '20',
                color: tag.color,
                borderColor: tag.color + '50',
              }"
            >
              {{ tag.title }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 relative">
        <!-- Value -->
        <div
          class="text-sm font-semibold tabular-nums transition-all duration-200"
          :class="
            expense.expenseType === 'EXPENSE' ? 'text-black' : 'text-gray-400'
          "
        >
          {{ formatValue(expense) }}
        </div>

        <!-- Actions -->
        <div
          class="absolute right-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-x-16"
        >
          <!-- Update -->
          <button
            class="p-1.5 rounded hover:bg-gray-100"
            @click.stop="emit('update', expense)"
          >
            <font-awesome-icon :icon="['fas', 'pen']" />
          </button>

          <!-- Delete -->
          <button
            class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-black"
            @click.stop="emit('delete', expense)"
          >
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
