<template>
  <div class="flex items-center w-full">
    <span>
      <slot></slot>
    </span>

    <button
      @click="toggleOrderBy"
      class="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors ml-2"
      :aria-label="'Sort by ' + (value ?? 'none')"
    >
      <font-awesome-icon icon="sort" class="text-gray-400" v-if="!direction" />
      <font-awesome-icon
        icon="arrow-up"
        class="text-gray-600"
        v-else-if="direction === 'asc'"
      />
      <font-awesome-icon
        icon="arrow-down"
        class="text-gray-600"
        v-else-if="direction === 'desc'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface Props {
  value: unknown;
  direction: unknown;
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
