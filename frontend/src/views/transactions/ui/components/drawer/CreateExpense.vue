<template>
  <BaseDrawer v-show="drawerIsVisible" @on-close="closeModal">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Create Expense</h2>
    </template>

    <template #default>
      <div class="flex flex-col gap-3">
        <!-- Value -->
        <BaseInput
          v-bind="valueAttrs"
          id="expense-value"
          v-model="value"
          label="Value"
          placeholder="Expense Value"
          :error="errors.value"
          type="number"
          size="Medium"
        />

        <!-- Expense Type -->
        <BaseSelect
          v-bind="expenseTypeAttrs"
          id="expense-type"
          v-model="expenseType"
          label="Expense Type"
          :error="errors.expenseType"
          :options="[
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Income', value: 'INCOME' },
          ]"
        />

        <!-- Payment Type -->
        <BaseSelect
          v-bind="paymentTypeAttrs"
          id="payment-type"
          v-model="paymentType"
          label="Payment Type"
          :error="errors.paymentType"
          :options="[
            { label: 'Cash', value: 'CASH' },
            { label: 'Card', value: 'CARD' },
          ]"
        />

        <!-- Category -->
        <CategoryAutocompletePicker
          v-bind="categoryIdAttrs"
          id="expense-category"
          v-model="selectedCategory"
          :error="errors.categoryId"
          label="Category"
          clearable
        />

        <!-- Tags -->
        <TagAutocompletePicker
          v-bind="tagIdsAttrs"
          id="expense-tags"
          v-model="selectedTags"
          :multiple="true"
          :error="errors.tagIds"
          label="Tags"
          clearable
        />

        <!-- Description -->
        <BaseInput
          v-bind="descriptionAttrs"
          id="expense-description"
          v-model="description"
          label="Description"
          placeholder="Description"
          :error="errors.description"
          type="text"
          size="Medium"
        />

        <!-- Created At -->
        <BaseInput
          id="created-at"
          v-model="createdAtModelValue"
          type="datetime-local"
          label="Expense Date"
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

const createdAtModelValue = computed({
  get() {
    return createdAt.value ? toDatetimeLocal(createdAt.value) : null;
  },
  set(newValue: string | undefined) {
    if (newValue) {
      createdAt.value = new Date(newValue).toISOString();
    } else {
      createdAt.value = undefined;
    }
  },
});

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
