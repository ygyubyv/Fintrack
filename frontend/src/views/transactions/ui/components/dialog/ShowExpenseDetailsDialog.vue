<template>
  <BaseDialog
    v-if="dialogIsVisible"
    @close="emit('update:dialogIsVisible', false)"
  >
    <!-- Header -->
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Expense Details</h2>
    </template>

    <!-- Content -->
    <div class="flex flex-col gap-4 text-sm text-gray-800">
      <div class="grid grid-cols-2 gap-y-2">
        <!-- Value -->
        <span class="text-gray-500">Value</span>
        <span class="font-medium text-right">
          {{ expense.value }} {{ CURRENCY }}
        </span>

        <!-- Type -->
        <span class="text-gray-500">Type</span>
        <span
          class="font-medium text-right"
          :class="
            expense.expenseType === 'INCOME' ? 'text-green-600' : 'text-red-600'
          "
        >
          {{ expenseTypeLabel }}
        </span>

        <!-- Payment -->
        <span class="text-gray-500">Payment</span>
        <span class="font-medium text-right">
          {{ paymentTypeLabel }}
        </span>

        <!-- Category -->
        <span class="text-gray-500">Category</span>
        <span class="font-medium text-right">
          {{ expense.category?.title ?? "—" }}
        </span>
      </div>

      <!-- Tags -->
      <div class="flex flex-col gap-1">
        <span class="text-gray-500">Tags</span>

        <div v-if="expense.tags?.length" class="flex flex-wrap gap-1">
          <span
            v-for="tag in expense.tags"
            :key="tag.id"
            class="px-2 py-0.5 text-xs rounded border bg-gray-50"
          >
            {{ tag.title }}
          </span>
        </div>

        <span v-else class="text-gray-400 text-xs">No tags</span>
      </div>

      <!-- Description -->
      <div v-if="expense.description" class="flex flex-col gap-1">
        <span class="text-gray-500">Description</span>
        <p class="text-gray-800 leading-relaxed">
          {{ expense.description }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <BaseButton
        icon="xmark"
        text="Close"
        mode="Secondary"
        @click="emit('update:dialogIsVisible', false)"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from "@/components/base/BaseDialog.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import type { IExpense } from "../../../types";
import { CURRENCY } from "@/constants";
import { computed } from "vue";

interface Props {
  dialogIsVisible: boolean;
  expense: IExpense;
}

interface Emits {
  (e: "update:dialogIsVisible", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const expenseTypeLabel = computed(() => {
  return props.expense.expenseType === "INCOME" ? "Income" : "Expense";
});

const paymentTypeLabel = computed(() => {
  return props.expense.paymentType === "CASH" ? "Cash" : "Card";
});
</script>
