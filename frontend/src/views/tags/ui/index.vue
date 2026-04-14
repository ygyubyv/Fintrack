<script setup lang="ts">
import { usePaginatedList } from "@/composables/usePaginatedList";
import CreateTag from "./components/drawer/CreateTag.vue";
import type { ITag, IUpdateTag, TGetAllTagsFilters } from "../types";
import { TagsApi } from "../services/api/tags.api";
import { TagsService } from "../services/tags.service";
import TagsTable from "./components/TagsTable.vue";
import UpdateTag from "./components/drawer/UpdateTag.vue";
import ImportTags from "./components/dialog/ImportTags.vue";

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
  updateSearchQueryParam,
} = usePaginatedList<ITag, TGetAllTagsFilters>(TagsApi.getAllTags);

const { createTag, updateTag, deleteTag, exportTags, importTags } =
  TagsService();

const { isLoading: createTagIsLoading, createTagHandler } = createTag(refresh);
const { isLoading: updateTagIsLoading, updateTagHandler } = updateTag(refresh);
const { isLoading: deleteTagIsLoading, deleteTagHandler } = deleteTag(refresh);
const { isLoading: exportTagsIsLoading, exportTagsHandler } = exportTags();
const { isLoading: importTagsIsLoading, importTagsHandler } =
  importTags(refresh);

const createTagDrawerIsVisible = ref(false);
const updateTagDrawerIsVisible = ref(false);
const deleteTagDialogIsVisible = ref(false);
const importTagsDialogIsVisible = ref(false);

const selectedTag = ref<ITag | null>(null);

const isLoading = computed(() => {
  return (
    tagsIsLoading.value ||
    createTagIsLoading.value ||
    updateTagIsLoading.value ||
    deleteTagIsLoading.value ||
    exportTagsIsLoading.value ||
    importTagsIsLoading.value
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
    <BaseOverlay :overlay-is-visible="isLoading" />

    <!-- Create Tag -->
    <CreateTag
      v-model:drawer-is-visible="createTagDrawerIsVisible"
      @submit="createTagHandler"
    />

    <!-- Update Tag -->
    <UpdateTag
      v-if="selectedTag"
      v-model:drawer-is-visible="updateTagDrawerIsVisible"
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

    <!-- Import Tags -->
    <ImportTags
      v-model:dialog-is-visible="importTagsDialogIsVisible"
      @submit="importTagsHandler"
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
          icon="rotate-left"
          size="Medium"
          mode="Secondary"
          @click="resetFilters"
        />

        <!-- Import -->
        <BaseButton
          text="Import"
          icon="file-import"
          mode="Secondary"
          :on-click="() => (importTagsDialogIsVisible = true)"
        />

        <!-- Export -->
        <BaseButton
          text="Export"
          icon="file-export"
          mode="Secondary"
          :on-click="exportTagsHandler"
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
        @update:search-query-params="updateSearchQueryParam"
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

      <BasePagination v-model="page" :total-pages="lastPage" />
    </div>
  </section>
</template>
