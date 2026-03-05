<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2 sm:px-4"
    >
      <div
        class="bg-white border border-gray-300 p-6 rounded-2xl shadow-xl w-full max-w-[90%] sm:max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-4"
        ref="dialog"
      >
        <div>
          <slot name="header">
            <h2 class="text-xl font-semibold">{{ title }}</h2>
          </slot>
        </div>

        <div v-if="message" class="text-black text-sm">
          {{ message }}
        </div>

        <div class="flex flex-col gap-2">
          <slot> </slot>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <slot name="footer">
            <BaseButton
              :onClick="() => emit('close')"
              icon="xmark"
              :text="cancelText ?? 'Cancel'"
              mode="Secondary"
            />

            <BaseButton
              icon="check"
              :text="submitText ?? 'Submit'"
              mode="Primary"
              :onClick="() => emit('submit')"
            />
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

interface Props {
  title?: string;
  message?: string;
  submitText?: string;
  cancelText?: string;
}

defineProps<Props>();
const emit = defineEmits<{
  (e: "submit"): void;
  (e: "close"): void;
}>();

const dialog = useTemplateRef("dialog");

onClickOutside(dialog, () => {
  emit("close");
});
</script>
