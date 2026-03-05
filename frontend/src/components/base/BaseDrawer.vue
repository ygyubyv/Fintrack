<template>
  <div
    class="fixed top-0 right-0 z-50 h-full bg-white w-64 md:w-96 shadow-xl transform transition-transform duration-300 translate-x-0 flex flex-col"
    ref="drawer"
  >
    <div
      class="flex items-center p-4 pt-8 border-b"
      :class="headerHasContent ? 'justify-between' : 'justify-end'"
    >
      <div v-if="headerHasContent" class="flex items-center">
        <slot name="header"></slot>
      </div>

      <font-awesome-icon
        :icon="['fas', 'xmark']"
        class="cursor-pointer text-black"
        @click="emit('onClose')"
      />
    </div>

    <div class="p-6 flex-1 overflow-y-auto">
      <slot></slot>
    </div>

    <div class="p-4 pb-8 border-t">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, useSlots } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

interface Props {
  closeOutside?: boolean;
}

interface Emits {
  (e: "onClose"): void;
}

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  closeOutside: true,
});

const drawer = useTemplateRef("drawer");

const slots = useSlots();

const headerHasContent = computed(() => {
  return !!slots.header;
});

onClickOutside(drawer, () => {
  props.closeOutside && emit("onClose");
});
</script>
