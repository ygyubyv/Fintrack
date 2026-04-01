<script setup lang="ts">
interface Props {
  tabs: string[];
}

const props = defineProps<Props>();

const activeTab = defineModel<string>();

const onChangeTab = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="flex gap-6 border-b border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="onChangeTab(tab)"
      class="pb-2 text-sm capitalize"
      :class="
        activeTab === tab
          ? 'border-b-2 border-black font-medium'
          : 'text-gray-400'
      "
    >
      {{ tab }}
    </button>
  </div>
</template>
