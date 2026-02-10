<template>
  <div class="relative sm:hidden" ref="burgerRef">
    <!-- Burger button -->
    <button
      @click="toggleMenu"
      class="flex flex-col justify-between w-6 h-4.5 focus:outline-none"
    >
      <span
        :class="[
          'block h-0.5 w-full bg-black transition-all',
          isOpen ? 'rotate-45 translate-y-2' : '',
        ]"
      ></span>
      <span
        :class="[
          'block h-0.5 w-full bg-black transition-all my-1',
          isOpen ? 'opacity-0' : '',
        ]"
      ></span>
      <span
        :class="[
          'block h-0.5 w-full bg-black transition-all',
          isOpen ? '-rotate-45 -translate-y-2' : '',
        ]"
      ></span>
    </button>

    <!-- Menu -->
    <transition name="fade-scale">
      <div
        v-show="isOpen"
        class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
      >
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          @click="toggleMenu"
          class="block px-4 py-3 text-black font-medium hover:bg-gray-100 transition"
        >
          {{ link.label }}
        </RouterLink>

        <div class="border-t border-gray-200">
          <button
            @click="emit('logout')"
            class="w-full text-left px-4 py-3 text-black hover:bg-gray-100 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";
import { RouterLink } from "vue-router";

interface Link {
  label: string;
  to: string;
}

defineProps<{ links: Link[] }>();
const emit = defineEmits<{
  (e: "logout"): void;
}>();

const isOpen = ref(false);
const burgerRef = useTemplateRef("burgerRef");

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

onClickOutside(burgerRef, () => {
  isOpen.value = false;
});
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
