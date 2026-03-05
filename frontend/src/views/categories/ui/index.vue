<script setup lang="ts">
import BasePagination from "@/components/base/BasePagination.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { usePaginatedList } from "@/composables/usePaginatedList";
import type { ICategory, ICreateCategory, IUpdateCategory } from "../types";
import { CategoriesApi } from "../services/api/categories.api";
import { CategoriesService } from "../services/categories.service";
import { computed, ref } from "vue";
import BaseOverlay from "@/components/base/BaseOverlay.vue";
import UpdateCategory from "./components/drawer/UpdateCategory.vue";
import BaseConfirmDialog from "@/components/base/BaseConfirmDialog.vue";
import CreateCategory from "./components/drawer/CreateCategory.vue";
import CategoriesTable from "./components/CategoriesTable.vue";

const {
  page,
  perPage,
  lastPage,
  items,
  isLoading: categoriesIsLoading,
  paginationData,
  searchQueryParams,
  resetFilters,
  refresh,
} = usePaginatedList<ICategory>(CategoriesApi.getAllCategories);

const { createCategory, updateCategory, deleteCategory } = CategoriesService();

const { isLoading: createCategoryIsLoading, createCategoryHandler } =
  createCategory(refresh);
const { isLoading: updateCategoryIsLoading, updateCategoryHandler } =
  updateCategory(refresh);
const { isLoading: deleteCategoryIsLoading, deleteCategoryHandler } =
  deleteCategory(refresh);

const createCategoryDrawerIsVisible = ref(false);
const updateCategoryDrawerIsVisible = ref(false);
const deleteCategoryDialogIsVisible = ref(false);

const isLoading = computed(() => {
  return (
    categoriesIsLoading.value ||
    createCategoryIsLoading.value ||
    updateCategoryIsLoading.value ||
    deleteCategoryIsLoading.value
  );
});

const selectedCategory = ref<ICategory | null>(null);

const onUpdateCategory = (category: ICategory) => {
  selectedCategory.value = category;
  updateCategoryDrawerIsVisible.value = true;
};

const onDeleteCategory = (category: ICategory) => {
  selectedCategory.value = category;
  deleteCategoryDialogIsVisible.value = true;
};

const handleUpdateCategory = (payload: IUpdateCategory) => {
  updateCategoryHandler(selectedCategory.value!.id, payload);
};

const handleDeleteCategory = () => {
  deleteCategoryHandler(selectedCategory.value!.id);
};
</script>

<template>
  <section class="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm">
    <BaseOverlay v-show="isLoading" />

    <!-- Create Category -->
    <CreateCategory
      v-model:drawer-is-visible="createCategoryDrawerIsVisible"
      @submit="createCategoryHandler"
    />

    <!-- Update Category -->
    <UpdateCategory
      v-model:drawer-is-visible="updateCategoryDrawerIsVisible"
      v-if="selectedCategory"
      :initial-values="selectedCategory"
      @submit="handleUpdateCategory"
    />

    <!-- Delete Category -->
    <BaseConfirmDialog
      v-model="deleteCategoryDialogIsVisible"
      cancel-text="Cancel"
      confirm-text="Confirm"
      message="Are you sure you want to delete this category?"
      title="Delete Category"
      @confirm="handleDeleteCategory"
    />

    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
    >
      <div>
        <h2 class="text-2xl font-semibold text-neutral-900">Categories</h2>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <!-- Title Filter -->
        <BaseInput
          id="search"
          v-model="searchQueryParams.title"
          placeholder="Search tags..."
          size="Medium"
          class="sm:w-64"
        />

        <!-- Reset Filters -->
        <BaseButton
          text="Reset Filters"
          size="Medium"
          mode="Secondary"
          @click="resetFilters"
        />

        <!-- Create Category -->
        <BaseButton
          text="Create"
          size="Medium"
          mode="Primary"
          icon="plus"
          @click="createCategoryDrawerIsVisible = true"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <CategoriesTable
        :items="items"
        :search-query-params="searchQueryParams"
        @delete="onDeleteCategory"
        @update="onUpdateCategory"
      />
    </div>

    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 text-sm"
      >
        <div>{{ paginationData }}</div>
        <label class="flex items-center gap-2">
          Per page:
          <select
            v-model="perPage"
            class="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          >
            <option :value="5">5</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </label>
      </div>

      <BasePagination :total-pages="lastPage" v-model="page" />
    </div>
  </section>
</template>
