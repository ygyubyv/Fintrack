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
      <!-- Selected tags (for multiple) -->
      <template v-if="multiple && Array.isArray(selectedItems)">
        <span
          v-for="tag in selectedItems"
          :key="tag.id"
          class="flex items-center gap-1 px-2 py-0.5 text-xs rounded-md text-black shadow-sm"
          :style="{ backgroundColor: tag.color }"
        >
          {{ tag[itemTitle ?? "title"] }}
          <button
            class="ml-1 text-black/70 hover:text-white"
            @click.stop="toggleSelect(tag)"
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
            ? (selectedItems as any).title
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
          v-for="tag in items"
          :key="tag.id"
          @click.stop="toggleSelect(tag)"
          :class="[
            'flex items-center gap-3 px-3 py-2 cursor-pointer transition rounded-md mx-1',
            isSelected(tag)
              ? 'bg-blue-50 text-blue-700'
              : 'hover:bg-gray-100 active:bg-gray-200',
          ]"
        >
          <!-- Checkbox for multiple -->
          <div
            v-if="multiple"
            class="relative flex items-center justify-center w-4 h-4"
          >
            <div
              :class="[
                'w-4 h-4 rounded border flex items-center justify-center transition',
                isSelected(tag)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 bg-white',
              ]"
            >
              <font-awesome-icon
                v-if="isSelected(tag)"
                :icon="['fas', 'check']"
                class="text-xs text-white"
              />
            </div>
          </div>

          <!-- Tag title -->
          <span class="text-sm font-medium text-gray-800">{{
            tag[itemTitle ?? "title"]
          }}</span>

          <!-- Tag color -->
          <span
            class="w-3 h-3 rounded-sm border border-gray-200"
            :style="{ backgroundColor: tag.color }"
          />
        </li>

        <li ref="sentinel" class="h-1"></li>
      </ul>
    </div>

    <!-- Empty state -->
    <div
      v-if="isOpen && !isLoading && !items.length && search"
      class="absolute left-0 top-full z-20 mt-1 min-w-full bg-white border border-gray-200 rounded-lg shadow px-3 py-3 text-sm text-gray-500"
    >
      No tags found
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from "@vue/runtime-dom";
import type { ITag } from "../../types";
import axiosInstance, { baseURL } from "@/plugins/axios.plugin";
import { TagsApi } from "../../services/api/tags.api";
import type { TPaginatedResponse } from "@/types";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import { useIntersectionObserver } from "@vueuse/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  size?: "Small" | "Medium" | "Big";
  itemTitle?: keyof ITag;
  modelValue: ITag | ITag[] | null;
  multiple?: boolean;
  clearable?: boolean;
  error?: string;
}

interface Emits {
  (e: "update:modelValue", items: ITag | ITag[] | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  clearable: false,
});

const emit = defineEmits<Emits>();

const DEBOUNCE = 300; // ms

const items = ref<ITag[]>([]);
const total = ref<number | null>(null);
const isLoading = ref(false);

const page = ref(1);
const perPage = 10;

const search = ref("");
const isOpen = ref(false);
const selectedItems = ref<ITag | ITag[] | null>(null);

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

const isSelected = (tag: ITag) => {
  if (props.multiple) {
    const arr = selectedItems.value as ITag[] | null;

    return arr?.some((item) => {
      return item.id === tag.id;
    });
  }

  const item = selectedItems.value as ITag | null;
  return item?.id === tag.id;
};

const toggleSelect = (tag: ITag) => {
  if (props.multiple) {
    const arr = (selectedItems.value as ITag[] | null) ?? [];

    const exists = arr?.some((item) => {
      return item.id === tag.id;
    });

    if (exists) {
      selectedItems.value = arr?.filter((item) => {
        return item.id !== tag.id;
      });
    } else {
      selectedItems.value = [...arr, tag];
    }

    emit("update:modelValue", selectedItems.value);
    return;
  }

  selectedItems.value = tag;
  emit("update:modelValue", tag);
};

const clearSelection = () => {
  selectedItems.value = null;
  emit("update:modelValue", null);
};

const getAllTagsHandler = async () => {
  const getAllTagsApiUrl = new URL(`${baseURL}${TagsApi.getAllTags}`);

  getAllTagsApiUrl.searchParams.set("page", String(page.value));
  getAllTagsApiUrl.searchParams.set("perPage", String(perPage));

  search.value && getAllTagsApiUrl.searchParams.set("title", search.value);

  try {
    isLoading.value = true;

    const response = await axiosInstance.get<TPaginatedResponse<ITag>>(
      String(getAllTagsApiUrl),
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

// When the component is mounted we may receive only the ID(s) of selected items
// from the parent instead of the full objects. Since this component works with
// full objects internally (ITag), we need to resolve those IDs into actual items
// before the dropdown renders.
//
// For single select we request the specific item by its ID.
// For multiple select we currently load the list and assume selected items
// will be present in the response.
const initialLoadSelectedItems = async () => {
  try {
    isLoading.value = true;

    if (props.multiple && (props.modelValue as ITag[]).length) {
      const getAllTagsApiUrl = new URL(`${baseURL}${TagsApi.getAllTags}`);

      getAllTagsApiUrl.searchParams.set("page", String(1));
      getAllTagsApiUrl.searchParams.set(
        "perPage",
        String((props.modelValue as ITag[]).length),
      );

      (props.modelValue as ITag[]).forEach((tag) => {
        if (typeof tag === "object") {
          getAllTagsApiUrl.searchParams.append("tagIds[]", String(tag.id));
        }

        if (typeof tag === "number" || typeof tag === "string") {
          getAllTagsApiUrl.searchParams.append("tagIds[]", String(tag));
        }
      });

      const items = await axiosInstance.get<TPaginatedResponse<ITag>>(
        String(getAllTagsApiUrl),
      );

      selectedItems.value = items.data.data;
    }

    if (!props.multiple) {
      const id =
        (props.modelValue as ITag)?.id ||
        (props.modelValue as unknown as number);
      const getTagByIdApiUrl = new URL(`${baseURL}${TagsApi.getTagById(id)}`);
      const item = await axiosInstance.get(String(getTagByIdApiUrl));

      if (item) {
        selectedItems.value = item.data as ITag;
      }

      emit("update:modelValue", selectedItems.value);
    }
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

watchDebounced([search, page], getAllTagsHandler, {
  debounce: DEBOUNCE,
  immediate: true,
});

onMounted(async () => {
  if (props.modelValue) {
    await initialLoadSelectedItems();
  }
});
</script>
