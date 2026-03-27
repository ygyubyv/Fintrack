<template>
  <div class="flex flex-col w-full max-w-md relative" ref="root">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="mb-1 text-sm font-medium text-neutral-800"
    >
      {{ label }}
    </label>

    <!-- Select / Input -->
    <div
      class="flex flex-wrap items-center gap-2 border rounded-lg bg-white cursor-text transition-colors duration-200"
      :class="[
        sizeClasses,
        error
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 hover:border-gray-400',
      ]"
      @click="isOpen = true"
    >
      <!-- Selected items -->
      <template v-if="multiple && Array.isArray(selectedItems)">
        <span
          v-for="item in selectedItems"
          :key="item.id"
          class="flex items-center gap-1 px-2 py-0.5 text-xs rounded-md text-black shadow-sm"
        >
          {{ item[itemTitle ?? "title"] }}

          <button
            class="ml-1 text-black/70 hover:text-white"
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
            ? (selectedItems as any)[itemTitle ?? 'title']
            : placeholder
        "
        class="flex-1 min-w-16 outline-none bg-transparent"
      />

      <!-- Clear -->
      <button
        v-if="clearable && selectedItems"
        @click.stop="clearSelection"
        class="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition"
      >
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen && items.length"
      class="absolute left-0 top-full z-20 mt-1 min-w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
    >
      <ul class="py-1">
        <li
          v-for="item in items"
          :key="item.id"
          @click.stop="toggleSelect(item)"
          :class="[
            'flex items-center gap-3 px-3 py-2 cursor-pointer transition rounded-md mx-1',
            isSelected(item)
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-100 active:bg-gray-200',
          ]"
        >
          <!-- Checkbox -->
          <div
            v-if="multiple"
            class="relative flex items-center justify-center w-4 h-4"
          >
            <div
              :class="[
                'w-4 h-4 rounded border flex items-center justify-center transition',
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
            {{ item[itemTitle ?? "title"] }}
          </span>
        </li>

        <li ref="sentinel" class="h-1"></li>
      </ul>
    </div>

    <!-- Empty -->
    <div
      v-if="isOpen && !isLoading && !items.length && search"
      class="absolute left-0 top-full z-20 mt-1 min-w-full bg-white border border-gray-200 rounded-lg shadow px-3 py-3 text-sm text-gray-500"
    >
      No categories found
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "vue";
import type { ICategory } from "../../types";
import { baseURL } from "@/plugins/axios.plugin";
import { CategoriesApi } from "../../services/api/categories.api";
import type { TPaginatedResponse } from "@/types";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import { useIntersectionObserver } from "@vueuse/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useApi } from "@/composables/useApi";

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  size?: "Small" | "Medium" | "Big";
  itemTitle?: keyof ICategory;
  modelValue: ICategory | ICategory[] | null;
  multiple?: boolean;
  clearable?: boolean;
  error?: string;
}

interface Emits {
  (e: "update:modelValue", items: ICategory | ICategory[] | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  clearable: false,
});

const emit = defineEmits<Emits>();

const DEBOUNCE = 300; // ms;

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

const sizeClasses = computed(() => {
  switch (props.size) {
    case "Small":
      return "px-3 py-1.5 text-xs";
    case "Big":
      return "px-6 py-3 text-base";
    default:
      return "px-4 py-2 text-sm";
  }
});

const isSelected = (item: ICategory) => {
  if (props.multiple) {
    const arr = selectedItems.value as ICategory[] | null;
    return arr?.some((i) => i.id === item.id);
  }

  const selected = selectedItems.value as ICategory | null;
  return selected?.id === item.id;
};

const toggleSelect = (item: ICategory) => {
  if (props.multiple) {
    const arr = (selectedItems.value as ICategory[] | null) ?? [];

    const exists = arr.some((i) => i.id === item.id);

    selectedItems.value = exists
      ? arr.filter((i) => i.id !== item.id)
      : [...arr, item];

    emit("update:modelValue", selectedItems.value);
    return;
  }

  selectedItems.value = item;
  emit("update:modelValue", item);
};

const clearSelection = () => {
  selectedItems.value = null;
  emit("update:modelValue", null);
};

const getAllCategoriesHandler = async () => {
  const url = new URL(`${baseURL}${CategoriesApi.getAllCategories}`);

  url.searchParams.set("page", String(page.value));
  url.searchParams.set("perPage", String(perPage));

  if (search.value) {
    url.searchParams.set("title", search.value);
  }

  try {
    isLoading.value = true;

    const { $api } = useApi();

    const { data, meta } = await $api<TPaginatedResponse<ICategory>>({
      url: String(url),
    });

    if (page.value === 1) {
      items.value = data;
    } else {
      items.value = [...items.value, ...data];
    }

    total.value = meta.total;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// When the component is mounted we may receive only the ID(s) of selected items
// from the parent instead of the full objects. Since this component works with
// full objects internally (ICategory), we need to resolve those IDs into actual items
// before the dropdown renders.
//
// For single select we request the specific item by its ID.
// For multiple select we currently load the list and assume selected items
// will be present in the response.
const initialLoadSelectedItems = async () => {
  try {
    isLoading.value = true;

    const { $api } = useApi();

    if (props.multiple && (props.modelValue as ICategory[])?.length) {
      const url = new URL(`${baseURL}${CategoriesApi.getAllCategories}`);

      url.searchParams.set("page", "1");
      url.searchParams.set(
        "perPage",
        String((props.modelValue as ICategory[]).length),
      );

      (props.modelValue as ICategory[]).forEach((item) => {
        if (typeof item === "object") {
          url.searchParams.append("categoryIds[]", String(item.id));
        } else {
          url.searchParams.append("categoryIds[]", String(item));
        }
      });

      const { data } = await $api<TPaginatedResponse<ICategory>>({
        url: String(url),
      });

      selectedItems.value = data;
    }

    if (!props.multiple && props.modelValue) {
      const id =
        (props.modelValue as ICategory)?.id ||
        (props.modelValue as unknown as number);

      const url = new URL(`${baseURL}${CategoriesApi.getCategoryById(id)}`);

      selectedItems.value = await $api<ICategory>({
        url: String(url),
      });

      emit("update:modelValue", selectedItems.value);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

useIntersectionObserver(sentinel, ([entry]) => {
  if (!entry?.isIntersecting) return;
  if (isLoading.value) return;
  if (total.value && items.value.length >= total.value) return;

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

onMounted(async () => {
  if (props.modelValue) {
    await initialLoadSelectedItems();
  }
});
</script>
