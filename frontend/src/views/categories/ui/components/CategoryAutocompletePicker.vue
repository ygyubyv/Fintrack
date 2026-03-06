<template>
  <div class="relative w-full max-w-md" ref="root">
    <div
      class="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-text"
    >
      <template v-if="multiple && Array.isArray(selectedItems)">
        <span
          v-for="item in selectedItems"
          :key="item.id"
          class="flex items-center gap-1 px-2 py-0.5 text-xs rounded-md text-black shadow-sm"
        >
          {{ item.title }}

          <button
            class="ml-1 text-black/70 hover:text-white transition"
            @click.stop="toggleSelect(item)"
          >
            ✕
          </button>
        </span>
      </template>

      <!-- Input -->
      <input
        v-model="search"
        type="text"
        :placeholder="
          !multiple && selectedItems
            ? (selectedItems as ICategory).title
            : 'Search categories...'
        "
        class="flex-1 min-w-30 outline-none bg-transparent"
        @focus="isOpen = true"
      />

      <!-- Clear button -->
      <button
        v-if="clearable && selectedItems"
        @click.stop="clearSelection"
        class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition"
      >
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>

      <!-- Loader -->
      <font-awesome-icon
        v-if="isLoading"
        :icon="['fas', 'spinner']"
        class="animate-spin text-gray-500"
      />
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen && items.length"
      class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
    >
      <ul class="py-1">
        <li
          v-for="item in items"
          :key="item.id"
          @click="toggleSelect(item)"
          :class="[
            'flex items-center gap-3 px-3 py-2 cursor-pointer transition rounded-md mx-1',
            isSelected(item)
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-100 active:bg-gray-200',
          ]"
        >
          <div
            v-if="multiple"
            class="relative flex items-center justify-center w-4 h-4"
            @click.stop="toggleSelect(item)"
          >
            <div
              :class="[
                'w-4 h-4 rounded border transition flex items-center justify-center',
                isSelected(item)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-white',
              ]"
            >
              <font-awesome-icon
                v-if="isSelected(item)"
                :icon="['fas', 'check']"
                class="text-xs text-white"
              />
            </div>
          </div>

          <!-- Title -->
          <span class="text-sm font-medium text-gray-800">
            {{ item.title }}
          </span>
        </li>

        <li ref="sentinel" class="h-1"></li>
      </ul>
    </div>

    <!-- Empty state -->
    <div
      v-if="isOpen && !isLoading && !items.length && search"
      class="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow px-3 py-3 text-sm text-gray-500"
    >
      No category found
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "@vue/runtime-dom";
import type { ICategory } from "../../types";
import axiosInstance, { baseURL } from "@/plugins/axios.plugin";
import { CategoriesApi } from "../../services/api/categories.api";
import type { TPaginatedResponse } from "@/types";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import { useIntersectionObserver } from "@vueuse/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface Props {
  modelValue: ICategory | ICategory[] | null;
  multiple?: boolean;
  clearable?: boolean;
}

interface Emits {
  (e: "update:modelValue", items: ICategory | ICategory[] | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  clearable: false,
});

const emit = defineEmits<Emits>();

const DEBOUNCE = 300; // ms

const items = ref<ICategory[]>([]);
const total = ref<number | null>(null);
const isLoading = ref(false);

const page = ref(1);
const perPage = 10;

const search = ref("");
const isOpen = ref(false);
const selectedItems = ref<ICategory | ICategory[] | null>(null);

const root = useTemplateRef("root");
const sentinel = useTemplateRef("sentinel");

const isSelected = (category: ICategory) => {
  if (props.multiple) {
    const arr = selectedItems.value as ICategory[] | null;

    return arr?.some((item) => {
      return item.id === category.id;
    });
  }

  const item = selectedItems.value as ICategory | null;
  return item?.id === category.id;
};

const toggleSelect = (category: ICategory) => {
  if (props.multiple) {
    const arr = (selectedItems.value as ICategory[] | null) ?? [];

    const exists = arr?.some((item) => {
      return item.id === category.id;
    });

    if (exists) {
      selectedItems.value = arr?.filter((item) => {
        return item.id !== category.id;
      });
    } else {
      selectedItems.value = [...arr, category];
    }

    emit("update:modelValue", selectedItems.value);
    return;
  }

  selectedItems.value = category;
  emit("update:modelValue", category);
};

const clearSelection = () => {
  selectedItems.value = null;
  emit("update:modelValue", null);
};

const getAllCategoriesHandler = async () => {
  const getAllCategoriesApiUrl = new URL(
    `${baseURL}${CategoriesApi.getAllCategories}`,
  );

  getAllCategoriesApiUrl.searchParams.set("page", String(page.value));
  getAllCategoriesApiUrl.searchParams.set("perPage", String(perPage));

  search.value &&
    getAllCategoriesApiUrl.searchParams.set("title", search.value);

  try {
    isLoading.value = true;

    const response = await axiosInstance.get<TPaginatedResponse<ICategory>>(
      String(getAllCategoriesApiUrl),
    );

    if (page.value === 1) {
      items.value = response.data.data;
    } else {
      items.value = [...items.value, ...response.data.data];
    }

    total.value = response.data.meta.total;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

useIntersectionObserver(sentinel, ([entry]) => {
  if (!entry?.isIntersecting) {
    return;
  }

  if (isLoading.value) {
    return;
  }

  if (total.value && items.value.length >= total.value) {
    return;
  }

  page.value++;
});

onClickOutside(root, () => {
  isOpen.value = false;
});

watchDebounced(
  search,
  () => {
    page.value = 1;
  },
  { debounce: DEBOUNCE },
);

watchDebounced([search, page], getAllCategoriesHandler, {
  debounce: DEBOUNCE,
  immediate: true,
});
</script>
