<template>
  <button
    :aria-label="text"
    :disabled="disabled"
    :type="type"
    :class="[
      'flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none',
      modeClasses,
      sizeClasses,
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ]"
    @click="onClick"
  >
    <span v-if="text" :class="textClasses">{{ text }}</span>

    <font-awesome-icon
      v-if="icon"
      :icon="['fas', icon]"
      :class="iconSizeClass"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Size = "Small" | "Medium" | "Big";
type Mode = "Primary" | "Secondary" | "Muted" | "Danger";
type ButtonType = "button" | "submit";

interface Props {
  text?: string;
  size?: Size;
  mode?: Mode;
  type?: ButtonType;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  size: "Medium",
  mode: "Primary",
  type: "button",
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "Small":
      return "px-3 py-1.5 text-xs";
    case "Big":
      return "px-6 py-3 text-base";
    case "Medium":
    default:
      return "px-4 py-2 text-sm";
  }
});

const iconSizeClass = computed(() => {
  switch (props.size) {
    case "Small":
      return "text-sm";
    case "Big":
      return "text-xl";
    case "Medium":
    default:
      return "text-base";
  }
});

const textClasses = computed(() => {
  switch (props.size) {
    case "Small":
      return "text-xs";
    case "Big":
      return "text-base";
    case "Medium":
    default:
      return "text-sm";
  }
});

const modeClasses = computed(() => {
  switch (props.mode) {
    case "Primary":
      return "bg-black text-white hover:bg-gray-900";
    case "Secondary":
      return "border border-black text-black hover:bg-gray-100";
    case "Muted":
      return "bg-gray-200 text-black hover:bg-gray-300";
    case "Danger":
      return "bg-red-600 text-white hover:bg-red-700";
    default:
      return "";
  }
});
</script>
