<script setup lang="ts">
import type { ITag } from "../../types";
import { formatTimeWithHoursWithoutTimeZone } from "@/utils";

interface Props {
  items: ITag[];
  searchQueryParams: Record<string, unknown>;
}

interface Emits {
  (e: "update", tag: ITag): void;
  (e: "delete", tag: ITag): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <!-- Title -->
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
          Title
        </th>

        <!-- Color -->
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
          Color
        </th>

        <!-- Created At -->
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
          <BaseOrderBy
            v-model:value="searchQueryParams['orderByCreatedAt']"
            v-model:direction="searchQueryParams['orderByCreatedAtDirection']"
            >Created At
          </BaseOrderBy>
        </th>

        <!-- Updated At -->
        <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
          Updated At
        </th>

        <!-- Actions -->
        <th class="px-6 py-3 text-right text-sm font-medium text-gray-700">
          Actions
        </th>
      </tr>
    </thead>

    <tbody class="bg-white divide-y divide-gray-100">
      <tr
        v-for="tag in items"
        :key="tag.id"
        class="hover:bg-gray-50 transition"
      >
        <!-- Title -->
        <td class="px-6 py-4 text-gray-800 font-medium">
          {{ tag.title }}
        </td>

        <!-- Color -->
        <td class="px-6 py-4 flex items-center gap-2">
          <span
            class="w-4 h-4 rounded border border-gray-300"
            :style="{ backgroundColor: tag.color }"
          />
          <span class="text-gray-700 text-sm">{{ tag.color }}</span>
        </td>

        <!-- Created At -->
        <td class="px-6 py-4 text-gray-500 text-sm">
          {{ formatTimeWithHoursWithoutTimeZone(tag.createdAt) }}
        </td>

        <!-- Updated At -->
        <td class="px-6 py-4 text-gray-500 text-sm">
          {{ formatTimeWithHoursWithoutTimeZone(tag.updatedAt) }}
        </td>

        <!-- Actions -->
        <td class="px-6 py-4">
          <div class="flex items-center justify-end gap-2">
            <!-- Update -->
            <BaseButton
              @click="emit('update', tag)"
              icon="pen"
              size="Small"
              mode="Secondary"
            />

            <!-- Delete -->
            <BaseButton
              @click="emit('delete', tag)"
              icon="trash"
              size="Small"
              mode="Danger"
            />
          </div>
        </td>
      </tr>
    </tbody>

    <tfoot v-show="!items.length">
      <tr>
        <td colspan="12" class="text-center">No Items Found</td>
      </tr>
    </tfoot>
  </table>
</template>
