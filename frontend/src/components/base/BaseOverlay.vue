<template>
  <transition name="fade">
    <div
      v-if="overlayIsVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
interface Props {
  overlayIsVisible: boolean;
}

defineProps<Props>();
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
