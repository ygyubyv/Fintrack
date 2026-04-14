<template>
  <div class="flex items-center w-full">
    <span>
      <slot></slot>
    </span>

    <button
      class="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors ml-2"
      :aria-label="'Sort by ' + (value ?? 'none')"
      @click="toggleOrderBy"
    >
      <font-awesome-icon v-if="!direction" icon="sort" class="text-gray-400" />
      <font-awesome-icon
        v-else-if="direction === 'asc'"
        icon="arrow-up"
        class="text-gray-600"
      />
      <font-awesome-icon
        v-else-if="direction === 'desc'"
        icon="arrow-down"
        class="text-gray-600"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TSortDirection } from "@/types";

interface Props {
  value: boolean | null;
  direction: TSortDirection | null;
}

interface Emits {
  (e: "update:value", value: unknown): void;
  (e: "update:direction", direction: unknown): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const toggleOrderBy = () => {
  if (!props.value) {
    emit("update:value", true);
    emit("update:direction", "asc");
    return;
  }

  if (props.direction === "asc") {
    emit("update:direction", "desc");
    return;
  }

  if (props.direction === "desc") {
    emit("update:value", null);
    emit("update:direction", null);
    return;
  }
};
</script>
