<template>
  <BaseDrawer v-show="drawerIsVisible" @on-close="closeModal">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Edit Expense</h2>
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
        />

        <!-- Tags -->
        <TagAutocompletePicker
          v-model="selectedTags"
          :multiple="true"
          v-bind="tagIdsAttrs"
          :error="errors.tagIds"
          id="expense-tags"
          label="Tags"
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
          :disabled="!meta.valid || !meta.dirty"
          icon="check"
          type="submit"
          text="Update"
          mode="Primary"
          size="Medium"
          @click="handleSubmit"
        />
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseDrawer from "@/components/base/BaseDrawer.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import { useUpdateExpenseForm } from "../../../composables/validation/useUpdateExpenseForm";
import type { IExpense, IUpdateExpense } from "../../../types";
import TagAutocompletePicker from "@/views/tags/ui/components/TagAutocompletePicker.vue";
import type { ITag } from "@/views/tags/types";
import CategoryAutocompletePicker from "@/views/categories/ui/components/CategoryAutocompletePicker.vue";
import type { ICategory } from "@/views/categories/types";
import { ref, watch } from "vue";

interface Props {
  drawerIsVisible: boolean;
  expense: IExpense;
}

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: IUpdateExpense): void;
}

const props = defineProps<Props>();
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
  resetForm,
  onSubmit,
  setForm,
} = useUpdateExpenseForm({ emit });

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

watch(
  () => props.drawerIsVisible,
  (newVal) => {
    if (newVal) {
      setForm({
        value: Number(props.expense.value),
        categoryId: props.expense.category?.id ?? null,
        expenseType: props.expense.expenseType,
        paymentType: props.expense.paymentType,
        tagIds: props.expense.tags.map((tag) => {
          return tag.id;
        }),
        description: props.expense.description,
      });

      selectedTags.value = props.expense.tags;
      selectedCategory.value = props.expense.category;
    }
  },
  { immediate: true },
);
</script>
