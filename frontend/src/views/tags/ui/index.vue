<script setup lang="ts">
import BasePagination from "@/components/base/BasePagination.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { usePaginatedList } from "@/composables/usePaginatedList";
import CreateTag from "./components/drawer/CreateTag.vue";
import type { ITag, IUpdateTag } from "../types";
import { TagsApi } from "../services/api/tags.api";
import { TagsService } from "../services/tags.service";
import { computed, ref } from "vue";
import BaseOverlay from "@/components/base/BaseOverlay.vue";
import TagsTable from "./components/TagsTable.vue";
import UpdateTag from "./components/drawer/UpdateTag.vue";
import BaseConfirmDialog from "@/components/base/BaseConfirmDialog.vue";

const {
  page,
  perPage,
  lastPage,
  items,
  isLoading: tagsIsLoading,
  paginationData,
  searchQueryParams,
  resetFilters,
  refresh,
} = usePaginatedList<ITag>(TagsApi.getAllTags);

const { createTag, updateTag, deleteTag } = TagsService();

const { isLoading: createTagIsLoading, createTagHandler } = createTag(refresh);
const { isLoading: updateTagIsLoading, updateTagHandler } = updateTag(refresh);
const { isLoading: deleteTagIsLoading, deleteTagHandler } = deleteTag(refresh);

const createTagDrawerIsVisible = ref(false);
const updateTagDrawerIsVisible = ref(false);
const deleteTagDialogIsVisible = ref(false);

const selectedTag = ref<ITag | null>(null);

const isLoading = computed(() => {
  return (
    tagsIsLoading.value ||
    createTagIsLoading.value ||
    updateTagIsLoading.value ||
    deleteTagIsLoading.value
  );
});

const onUpdateTag = (tag: ITag) => {
  selectedTag.value = tag;
  updateTagDrawerIsVisible.value = true;
};

const onDeleteTag = (tag: ITag) => {
  selectedTag.value = tag;
  deleteTagDialogIsVisible.value = true;
};

const handleUpdateTag = (payload: IUpdateTag) => {
  updateTagHandler(selectedTag.value!.id, payload);
};

const handleDeleteTag = () => {
  deleteTagHandler(selectedTag.value!.id);
};
</script>

<template>
  <section class="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-sm">
    <BaseOverlay v-show="isLoading" />

    <!-- Create Tag -->
    <CreateTag
      v-model:drawer-is-visible="createTagDrawerIsVisible"
      @submit="createTagHandler"
    />

    <!-- Update Tag -->
    <UpdateTag
      v-model:drawer-is-visible="updateTagDrawerIsVisible"
      v-if="selectedTag"
      :initial-values="selectedTag"
      @submit="handleUpdateTag"
    />

    <!-- Delete Tag -->
    <BaseConfirmDialog
      v-model="deleteTagDialogIsVisible"
      cancel-text="Cancel"
      confirm-text="Confirm"
      message="Are you sure you want to delete this tag?"
      title="Delete Tag"
      @confirm="handleDeleteTag"
    />

    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
    >
      <div>
        <h2 class="text-2xl font-semibold text-neutral-900">Tags</h2>
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

        <!-- Create Tag -->
        <BaseButton
          text="Create"
          size="Medium"
          mode="Primary"
          icon="plus"
          @click="createTagDrawerIsVisible = true"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <TagsTable
        :items="items"
        :search-query-params="searchQueryParams"
        @delete="onDeleteTag"
        @update="onUpdateTag"
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
