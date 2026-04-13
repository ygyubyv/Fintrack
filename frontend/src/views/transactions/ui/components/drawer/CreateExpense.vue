<template>
  <BaseDrawer v-show="drawerIsVisible" @on-close="closeModal">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Create Expense</h2>
    </template>

    <template #default>
      <div class="flex flex-col gap-3">
        <!-- Value -->
        <BaseInput
          label="Value"
          v-model="value"
          placeholder="Expense Value"
          v-bind="valueAttrs"
          :error="errors.value"
          id="expense-value"
          type="number"
          size="Medium"
        />

        <!-- Expense Type -->
        <BaseSelect
          label="Expense Type"
          v-model="expenseType"
          v-bind="expenseTypeAttrs"
          :error="errors.expenseType"
          :options="[
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Income', value: 'INCOME' },
          ]"
          id="expense-type"
        />

        <!-- Payment Type -->
        <BaseSelect
          label="Payment Type"
          v-model="paymentType"
          v-bind="paymentTypeAttrs"
          :error="errors.paymentType"
          :options="[
            { label: 'Cash', value: 'CASH' },
            { label: 'Card', value: 'CARD' },
          ]"
          id="payment-type"
        />

        <!-- Category -->
        <CategoryAutocompletePicker
          v-model="selectedCategory"
          v-bind="categoryIdAttrs"
          :error="errors.categoryId"
          id="expense-category"
          label="Category"
          clearable
        />

        <!-- Tags -->
        <TagAutocompletePicker
          v-model="selectedTags"
          :multiple="true"
          v-bind="tagIdsAttrs"
          :error="errors.tagIds"
          id="expense-tags"
          label="Tags"
          clearable
        />

        <!-- Description -->
        <BaseInput
          label="Description"
          v-model="description"
          placeholder="Description"
          v-bind="descriptionAttrs"
          :error="errors.description"
          id="expense-description"
          type="text"
          size="Medium"
        />

        <!-- Created At -->
        <BaseInput
          id="created-at"
          type="datetime-local"
          label="Expense Date"
          :modelValue="toDatetimeLocal(createdAt as string) ?? null"
          @update:modelValue="
            (value) => (createdAt = new Date(value).toISOString())
          "
          v-bind="createdAtAttrs"
          size="Medium"
          :error="errors.createdAt"
        />
      </div>
    </template>

    <!-- Actions -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <!-- Cancel -->
        <BaseButton
          icon="xmark"
          text="Cancel"
          mode="Muted"
          size="Medium"
          @click="closeModal"
        />

        <!-- Submit -->
        <BaseButton
          icon="check"
          type="submit"
          text="Create"
          mode="Primary"
          size="Medium"
          @click="handleSubmit"
        />
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { useCreateExpenseForm } from "../../../composables/validation/useCreateExpenseForm";
import type { ICreateExpense } from "../../../types";
import TagAutocompletePicker from "@/views/tags/ui/components/TagAutocompletePicker.vue";
import type { ITag } from "@/views/tags/types";
import CategoryAutocompletePicker from "@/views/categories/ui/components/CategoryAutocompletePicker.vue";
import type { ICategory } from "@/views/categories/types";
import { toDatetimeLocal } from "@/utils";

interface Props {
  drawerIsVisible: boolean;
}

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: ICreateExpense): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const {
  meta,
  value,
  valueAttrs,
  expenseType,
  expenseTypeAttrs,
  paymentType,
  paymentTypeAttrs,
  categoryId,
  categoryIdAttrs,
  tagIds,
  tagIdsAttrs,
  description,
  descriptionAttrs,
  errors,
  createdAt,
  createdAtAttrs,
  resetForm,
  onSubmit,
} = useCreateExpenseForm({ emit });

const selectedTags = ref<ITag[]>([]);
const selectedCategory = ref<ICategory | null>(null);

const closeModal = () => {
  selectedCategory.value = null;
  selectedTags.value = [];
  resetForm();
  emit("update:drawerIsVisible", false);
};

const handleSubmit = async () => {
  try {
    await onSubmit();

    selectedCategory.value = null;
    selectedTags.value = [];
  } catch (error) {
    console.error(error);
  }
};

watch(selectedTags, (newVal) => {
  if (newVal) {
    tagIds.value = newVal.map((tag) => {
      return tag.id;
    });
  }
});

watch(selectedCategory, (newVal) => {
  if (newVal) {
    categoryId.value = newVal.id;
  }
});
</script>
