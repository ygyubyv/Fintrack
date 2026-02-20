<script setup lang="ts">
import type { AuthMode } from "../../types";

defineProps<{
  mode: AuthMode;
}>();

const emit = defineEmits<{
  (e: "change", value: AuthMode): void;
}>();
</script>

<template>
  <div class="mb-6 rounded-xl bg-neutral-100 p-1.5 flex relative">
    <button
      class="relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
      :class="
        mode === 'login'
          ? 'bg-white shadow text-black'
          : 'text-neutral-500 hover:text-neutral-900'
      "
      @click="emit('change', 'login')"
    >
      Login
    </button>

    <button
      class="relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
      :class="
        mode === 'register'
          ? 'bg-white shadow text-black'
          : 'text-neutral-500 hover:text-neutral-900'
      "
      @click="emit('change', 'register')"
    >
      Register
    </button>
  </div>
</template>
