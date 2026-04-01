<script setup lang="ts">
import { ref, watch } from "vue";
import BaseTabs from "@/components/base/BaseTabs.vue";

interface Props {
  searchQueryParams: Record<string, unknown>;
}

type TTimeTabsItem = "1week" | "1month" | "3months" | "1year";

const props = defineProps<Props>();

const activeTimeTab = ref<TTimeTabsItem>("1month");
const timeTabItems: TTimeTabsItem[] = ["1week", "1month", "3months", "1year"];

watch(
  activeTimeTab,
  (newVal) => {
    const now = new Date().toISOString();

    props.searchQueryParams["createdToDate"] = now;

    switch (newVal) {
      case "1week":
        const weekAgo = new Date(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
        props.searchQueryParams["createdFromDate"] = weekAgo;
        break;

      case "1month":
        const monthAgo = new Date(
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString();
        props.searchQueryParams["createdFromDate"] = monthAgo;
        break;

      case "3months":
        const threeMonthsAgo = new Date(
          new Date().getTime() - 90 * 24 * 60 * 60 * 1000,
        ).toISOString();
        props.searchQueryParams["createdFromDate"] = threeMonthsAgo;
        break;

      case "1year":
        const yearAgo = new Date(
          new Date().getTime() - 365 * 24 * 60 * 60 * 1000,
        ).toISOString();
        props.searchQueryParams["createdFromDate"] = yearAgo;
        break;

      default:
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
