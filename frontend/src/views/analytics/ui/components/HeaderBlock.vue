<script setup lang="ts">
interface Props {
  searchQueryParams: Record<string, unknown>;
}

interface Emits {
  (e: "update:searchQueryParams", key: string, value: unknown): void;
}

type TTimeTabsItem = "1week" | "1month" | "3months" | "1year";

defineProps<Props>();
const emit = defineEmits<Emits>();

const activeTimeTab = ref<TTimeTabsItem>("1month");
const timeTabItems: TTimeTabsItem[] = ["1week", "1month", "3months", "1year"];

watch(
  activeTimeTab,
  (newVal) => {
    const now = new Date().toISOString();

    emit("update:searchQueryParams", "createdToDate", now);

    switch (newVal) {
      case "1week": {
        const weekAgo = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();

        emit("update:searchQueryParams", "createdFromDate", weekAgo);
        break;
      }

      case "1month": {
        const monthAgo = new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString();

        emit("update:searchQueryParams", "createdFromDate", monthAgo);
        break;
      }

      case "3months": {
        const threeMonthsAgo = new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000,
        ).toISOString();

        emit("update:searchQueryParams", "createdFromDate", threeMonthsAgo);
        break;
      }

      case "1year": {
        const yearAgo = new Date(
          Date.now() - 365 * 24 * 60 * 60 * 1000,
        ).toISOString();

        emit("update:searchQueryParams", "createdFromDate", yearAgo);
        break;
      }
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="flex justify-between items-center">
    <!-- Title -->
    <h2 class="text-xl font-semibold">Analytics</h2>

    <!-- Tabs -->
    <BaseTabs v-model="activeTimeTab" :tabs="timeTabItems" />
  </div>
</template>
