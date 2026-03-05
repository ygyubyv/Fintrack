<template>
  <div
    v-show="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  >
    <div
      ref="dialog"
      class="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 animate-fade-in"
    >
      <h2 class="text-xl font-semibold text-gray-900 mb-3">
        {{ title }}
      </h2>

      <p class="text-gray-700 text-sm mb-6">
        {{ message }}
      </p>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          @click="cancel"
        >
          {{ cancelText }}
        </button>

        <button
          class="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-gray-900 transition"
          @click="confirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

interface Props {
  modelValue: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

interface Emits {
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "update:modelValue", value: boolean): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const dialog = useTemplateRef("dialog");

const confirm = () => {
  emit("confirm");
  emit("update:modelValue", false);
};

const cancel = () => {
  emit("cancel");
  emit("update:modelValue", false);
};

onClickOutside(dialog, () => {
  cancel();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.15s ease-out;
}
</style>
