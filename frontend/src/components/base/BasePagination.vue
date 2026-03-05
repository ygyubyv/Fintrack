<template>
  <div class="flex self-end justify-center mt-10 gap-2 flex-wrap">
    <!-- Left arrow button -->
    <button
      v-if="totalPages > 1"
      @click="currentPage--"
      :disabled="currentPage === 1"
      type="button"
      class="px-3 py-2 rounded-md text-sm font-medium border border-black/80 text-black bg-white shadow-[0_1px_0_#000] transition hover:bg-black hover:text-white hover:-translate-y-px active:translate-y-0 active:shadow-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black disabled:hover:translate-y-0 disabled:shadow-none"
    >
      ←
    </button>
    <!-- Left arrow button -->

    <!-- First page button -->
    <button
      @click="currentPage = 1"
      :class="[
        'px-3 py-2 rounded-md text-sm font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        currentPage === 1
          ? 'bg-black text-white border-black shadow-[0_1px_0_#000]'
          : 'border-black/80 text-black bg-white shadow-[0_1px_0_#000] hover:bg-black hover:text-white hover:-translate-y-px active:translate-y-0 active:shadow-none active:scale-[0.98]',
      ]"
    >
      1
    </button>
    <!-- First page button -->

    <!-- Numerable buttons -->
    <button
      v-for="page in reachablePages"
      :key="page"
      @click="currentPage = page"
      :class="[
        'px-3 py-2 rounded-md text-sm font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        currentPage === page
          ? 'bg-black text-white border-black shadow-[0_1px_0_#000]'
          : 'border-black/80 text-black bg-white shadow-[0_1px_0_#000] hover:bg-black hover:text-white hover:-translate-y-px active:translate-y-0 active:shadow-none active:scale-[0.98]',
      ]"
    >
      {{ page }}
    </button>
    <!-- Numerable buttons -->

    <!-- Last page button -->
    <button
      v-if="totalPages > 1"
      @click="currentPage = totalPages"
      :class="[
        'px-3 py-2 rounded-md text-sm font-medium border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        currentPage === totalPages
          ? 'bg-black text-white border-black shadow-[0_1px_0_#000]'
          : 'border-black/80 text-black bg-white shadow-[0_1px_0_#000] hover:bg-black hover:text-white hover:-translate-y-px active:translate-y-0 active:shadow-none active:scale-[0.98]',
      ]"
    >
      {{ totalPages }}
    </button>
    <!-- Last page button -->

    <!-- Right arrow button -->
    <button
      @click="currentPage++"
      :disabled="currentPage === totalPages"
      type="button"
      class="px-3 py-2 rounded-md text-sm font-medium border border-black/80 text-black bg-white shadow-[0_1px_0_#000] transition hover:bg-black hover:text-white hover:-translate-y-px active:translate-y-0 active:shadow-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black disabled:hover:translate-y-0 disabled:shadow-none"
      v-if="totalPages > 1"
    >
      →
    </button>
    <!-- Right arrow button -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  totalPages: number;
}

const props = defineProps<Props>();

const currentPage = defineModel<number>({
  default: 1,
});

const reachablePages = computed(() => {
  const pages: number[] = [];

  const first = 1;
  const last = props.totalPages;

  if (props.totalPages <= 2) return [];

  if (currentPage.value <= 2) {
    pages.push(2, 3, 4);
  } else if (currentPage.value >= props.totalPages - 1) {
    pages.push(last - 3, last - 2, last - 1);
  } else {
    pages.push(currentPage.value - 1, currentPage.value, currentPage.value + 1);
  }

  return pages.filter((p) => p > first && p < last);
});
</script>
