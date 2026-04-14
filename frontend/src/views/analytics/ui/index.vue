<script setup lang="ts">
import StatisticsBlock from "./components/StatisticsBlock.vue";
import HeaderBlock from "./components/HeaderBlock.vue";
import CategoriesBlock from "./components/CategoriesBlock.vue";
import Skeleton from "./components/Skeleton.vue";
import ChartsBlock from "./components/ChartsBlock.vue";
import { usePaginatedList } from "../composables/usePaginatedList";
import TagsBlock from "./components/TagsBlock.vue";

const { items, searchQueryParams, isLoading } = usePaginatedList();
</script>

<template>
  <div>
    <div v-show="!isLoading" class="p-4 space-y-6">
      <!-- Header -->
      <HeaderBlock
        :search-query-params="searchQueryParams"
        @update:search-query-params="
          (key, value) => (searchQueryParams[key] = value)
        "
      />

      <!-- Stats -->
      <StatisticsBlock :items="items" />

      <!-- Categories -->
      <CategoriesBlock :items="items" />

      <!-- Charts -->
      <ChartsBlock :items="items" />

      <!-- Tags -->
      <TagsBlock :items="items" />
    </div>

    <div v-show="isLoading">
      <Skeleton />
    </div>
  </div>
</template>
