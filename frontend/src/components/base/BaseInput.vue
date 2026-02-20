<template>
  <div class="flex flex-col w-full">
    <label
      v-if="label"
      :for="id"
      class="mb-1 text-sm font-medium text-neutral-800"
    >
      {{ label }}
    </label>

    <input
      v-model="inputValue"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-bind="$attrs"
      :class="[
        'w-full rounded-lg border transition-colors duration-200 focus:outline-none',
        sizeClasses,
        error
          ? 'border-red-500 bg-red-50 focus:ring-red-400'
          : 'border-neutral-300 focus:border-black focus:ring-black/30',
      ]"
    />

    <p v-if="error" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "month"
  | "week"
  | "time"
  | "color";

type Size = "Small" | "Medium" | "Big";

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  type?: InputType;
  error?: string;
  size?: Size;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  size: "Medium",
});

defineOptions({
  inheritAttrs: false,
});

const inputValue = defineModel();

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
</script>

<style scoped>
input {
  appearance: none;
  -webkit-appearance: none;
}
</style>
