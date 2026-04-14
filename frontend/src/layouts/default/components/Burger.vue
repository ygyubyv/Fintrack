<template>
  <div ref="burgerRef" class="relative sm:hidden">
    <!-- Burger button -->
    <button
      class="flex flex-col justify-between w-6 h-4.5 focus:outline-none"
      @click="toggleMenu"
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
          class="block px-4 py-3 text-black font-medium hover:bg-gray-100 transition"
          @click="toggleMenu"
        >
          {{ link.label }}
        </RouterLink>

        <div class="border-t border-gray-200">
          <button
            v-if="isAuthenticated"
            class="w-full text-left px-4 py-3 text-black hover:bg-gray-100 transition font-medium"
            @click="emit('logout')"
          >
            Logout
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Link {
  label: string;
  to: string;
}

interface Props {
  links: Link[];
  isAuthenticated: boolean;
}

interface Emits {
  (e: "logout"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

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
