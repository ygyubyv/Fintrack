<script setup lang="ts">
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import { onMounted, ref, watch } from "vue";
import { toDatetimeLocal } from "@/utils";
import TagAutocompletePicker from "@/views/tags/ui/components/TagAutocompletePicker.vue";
import type { ITag } from "@/views/tags/types";
import type { ICategory } from "@/views/categories/types";
import CategoryAutocompletePicker from "@/views/categories/ui/components/CategoryAutocompletePicker.vue";

interface Props {
  searchQueryParams: Record<string, unknown>;
}

interface Emits {
  (e: "resetFilters"): void;
  (e: "addNewExpense"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const filtersExpanded = ref(false);

const selectedTag = ref<ITag | null>(
  (props.searchQueryParams["tagIds[]"] as ITag) ?? null,
);
const selectedCategory = ref<ICategory | null>(
  (props.searchQueryParams.categoryId as ICategory) ?? null,
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

watch(
  selectedTag,
  (newVal) => {
    if (newVal) {
      props.searchQueryParams["tagIds[]"] = selectedTag.value?.id;
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
      props.searchQueryParams.categoryId = selectedCategory.value?.id;
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
        type="datetime-local"
        label="Date from"
        class="w-44"
        :modelValue="
          toDatetimeLocal(searchQueryParams['createdFromDate'] as string) ??
          null
        "
        @update:modelValue="
          (value) =>
            (searchQueryParams['createdFromDate'] = new Date(
              value,
            ).toISOString())
        "
      />

      <!-- Created To -->
      <BaseInput
        id="createdTo"
        type="datetime-local"
        label="Date to"
        class="w-44"
        :modelValue="
          toDatetimeLocal(searchQueryParams['createdToDate'] as string) ?? null
        "
        @update:modelValue="
          (value) =>
            (searchQueryParams['createdToDate'] = new Date(value).toISOString())
        "
      />

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Open / Close Filters -->
      <BaseButton
        :text="filtersExpanded ? 'Hide filters' : 'Filters'"
        icon="sliders"
        mode="Secondary"
        size="Small"
        :onClick="toggleFilters"
      />

      <!-- Reset Filters -->
      <BaseButton
        text="Reset"
        icon="rotate-left"
        mode="Muted"
        size="Small"
        :onClick="handleResetFilters"
      />

      <!-- Add New Expense -->
      <BaseButton
        text="New"
        icon="plus"
        mode="Primary"
        size="Small"
        :onClick="() => emit('addNewExpense')"
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
          label="Description"
          placeholder="Coffee..."
          v-model="searchQueryParams['description']"
        />

        <!-- Expense Type -->
        <BaseSelect
          id="expenseType"
          label="Type"
          v-model="searchQueryParams.expenseType"
          :options="[
            { label: 'All types', value: undefined },
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Income', value: 'INCOME' },
          ]"
        />

        <!-- Payment Type -->
        <BaseSelect
          id="paymentType"
          label="Payment Type"
          v-model="searchQueryParams.paymentType"
          :options="[
            { label: 'All types', value: undefined },
            { label: 'Cash', value: 'CASH' },
            { label: 'Card', value: 'CARD' },
          ]"
        />

        <!-- Value From -->
        <BaseInput
          id="valueFrom"
          type="number"
          label="Value from"
          placeholder="0"
          v-model.number="searchQueryParams['valueFrom']"
        />

        <!-- Value To -->
        <BaseInput
          id="valueTo"
          type="number"
          label="Value to"
          placeholder="1000"
          v-model.number="searchQueryParams['valueTo']"
        />

        <!-- Tag -->
        <TagAutocompletePicker
          v-model="selectedTag"
          id="tags"
          label="Filter By Included Tag"
        />

        <!-- Category -->
        <CategoryAutocompletePicker
          v-model="selectedCategory"
          id="category"
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
