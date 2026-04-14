<script setup lang="ts">
import { toDatetimeLocal } from "@/utils";
import TagAutocompletePicker from "@/views/tags/ui/components/TagAutocompletePicker.vue";
import type { ITag } from "@/views/tags/types";
import type { ICategory } from "@/views/categories/types";
import CategoryAutocompletePicker from "@/views/categories/ui/components/CategoryAutocompletePicker.vue";
import type {
  TExpenseType,
  TGetAllExpensesFilters,
  TPaymentType,
} from "../../types";

interface Props {
  searchQueryParams: TGetAllExpensesFilters;
}

interface Emits {
  (e: "resetFilters"): void;
  (e: "addNewExpense"): void;
  (e: "export"): void;
  (e: "import"): void;
  (
    e: "update:searchQueryParams",
    key: keyof TGetAllExpensesFilters,
    value: TGetAllExpensesFilters[keyof TGetAllExpensesFilters],
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filtersExpanded = ref(false);

const selectedTag = ref<ITag | null>(
  (props.searchQueryParams["tagIds[]"] as unknown as ITag) ?? null,
);

const selectedCategory = ref<ICategory | null>(
  (props.searchQueryParams.categoryId as unknown as ICategory) ?? null,
);

const toggleFilters = () => {
  filtersExpanded.value = !filtersExpanded.value;
};

const handleResetFilters = () => {
  filtersExpanded.value = false;

  selectedTag.value = null;
  selectedCategory.value = null;

  emit("resetFilters");
};

const createdFromModelValue = computed({
  get() {
    return props.searchQueryParams["createdFromDate"]
      ? toDatetimeLocal(props.searchQueryParams["createdFromDate"])
      : null;
  },
  set(newValue: string | undefined) {
    if (newValue) {
      emit(
        "update:searchQueryParams",
        "createdFromDate",
        new Date(newValue).toISOString(),
      );
    } else {
      emit("update:searchQueryParams", "createdFromDate", undefined);
    }
  },
});

const createdToModelValue = computed({
  get() {
    return props.searchQueryParams["createdToDate"]
      ? toDatetimeLocal(props.searchQueryParams["createdToDate"])
      : null;
  },
  set(newValue: string | undefined) {
    if (newValue) {
      emit(
        "update:searchQueryParams",
        "createdToDate",
        new Date(newValue).toISOString(),
      );
    } else {
      emit("update:searchQueryParams", "createdToDate", undefined);
    }
  },
});

const descriptionModelValue = computed({
  get() {
    return props.searchQueryParams["description"];
  },
  set(newValue: string) {
    emit("update:searchQueryParams", "description", newValue);
  },
});

const valueFromModelValue = computed({
  get() {
    return props.searchQueryParams["valueFrom"];
  },
  set(newValue: number) {
    emit("update:searchQueryParams", "valueFrom", newValue);
  },
});

const valueToModelValue = computed({
  get() {
    return props.searchQueryParams["valueTo"];
  },
  set(newValue: number) {
    emit("update:searchQueryParams", "valueTo", newValue);
  },
});

const expenseTypeModelValue = computed({
  get() {
    return props.searchQueryParams.expenseType;
  },
  set(newValue: TExpenseType | null) {
    emit("update:searchQueryParams", "expenseType", newValue ?? undefined);
  },
});

const paymentTypeModelValue = computed({
  get() {
    return props.searchQueryParams.paymentType;
  },
  set(newValue: TPaymentType | null) {
    emit("update:searchQueryParams", "paymentType", newValue ?? undefined);
  },
});

watch(
  selectedTag,
  (newVal) => {
    if (newVal) {
      emit("update:searchQueryParams", "tagIds[]", newVal.id);
    }
  },
  {
    immediate: false,
  },
);

watch(
  selectedCategory,
  (newVal) => {
    if (newVal) {
      emit("update:searchQueryParams", "categoryId", newVal.id);
    }
  },
  {
    immediate: false,
  },
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-end gap-3">
      <!-- Created From -->
      <BaseInput
        id="createdFrom"
        v-model="createdFromModelValue"
        type="datetime-local"
        label="Date from"
        class="w-44"
      />

      <!-- Created To -->
      <BaseInput
        id="createdTo"
        v-model="createdToModelValue"
        type="datetime-local"
        label="Date to"
        class="w-44"
      />

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Open / Close Filters -->
      <BaseButton
        :text="filtersExpanded ? 'Hide filters' : 'Filters'"
        icon="sliders"
        mode="Secondary"
        :on-click="toggleFilters"
      />

      <!-- Reset Filters -->
      <BaseButton
        text="Reset Filters"
        icon="rotate-left"
        mode="Secondary"
        :on-click="handleResetFilters"
      />

      <!-- Import -->
      <BaseButton
        text="Import"
        icon="file-import"
        mode="Secondary"
        :on-click="() => emit('import')"
      />

      <!-- Export -->
      <BaseButton
        text="Export"
        icon="file-export"
        mode="Secondary"
        :on-click="() => emit('export')"
      />

      <!-- Add New Expense -->
      <BaseButton
        text="New"
        icon="plus"
        mode="Primary"
        :on-click="() => emit('addNewExpense')"
      />
    </div>

    <!-- Expanded Filters -->
    <transition name="filters">
      <div
        v-if="filtersExpanded"
        class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2"
      >
        <!-- Description -->
        <BaseInput
          id="search"
          v-model="descriptionModelValue"
          label="Description"
          placeholder="Coffee..."
        />

        <!-- Expense Type -->
        <BaseSelect
          id="expenseType"
          v-model="expenseTypeModelValue"
          label="Type"
          :options="[
            { label: 'All types', value: null },
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Income', value: 'INCOME' },
          ]"
        />

        <!-- Payment Type -->
        <BaseSelect
          id="paymentType"
          v-model="paymentTypeModelValue"
          label="Payment Type"
          :options="[
            { label: 'All types', value: null },
            { label: 'Cash', value: 'CASH' },
            { label: 'Card', value: 'CARD' },
          ]"
        />

        <!-- Value From -->
        <BaseInput
          id="valueFrom"
          v-model.number="valueFromModelValue"
          type="number"
          label="Value from"
          placeholder="0"
        />

        <!-- Value To -->
        <BaseInput
          id="valueTo"
          v-model.number="valueToModelValue"
          type="number"
          label="Value to"
          placeholder="1000"
        />

        <!-- Tag -->
        <TagAutocompletePicker
          id="tags"
          v-model="selectedTag"
          label="Filter By Included Tag"
        />

        <!-- Category -->
        <CategoryAutocompletePicker
          id="category"
          v-model="selectedCategory"
          label="Filter By Category"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.filters-enter-active,
.filters-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.filters-enter-from,
.filters-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.filters-enter-to,
.filters-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
