<script setup lang="ts">
import type { ICategory } from "../../types";
import { formatTimeWithHoursWithoutTimeZone } from "@/utils";

interface Props {
  items: ICategory[];
  searchQueryParams: Record<string, unknown>;
}

interface Emits {
  (e: "update", category: ICategory): void;
  (e: "delete", category: ICategory): void;
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
        v-for="category in items"
        :key="category.id"
        class="hover:bg-gray-50 transition"
      >
        <!-- Title -->
        <td class="px-6 py-4 text-gray-800 font-medium">
          {{ category.title }}
        </td>

        <!-- Created At -->
        <td class="px-6 py-4 text-gray-500 text-sm">
          {{ formatTimeWithHoursWithoutTimeZone(category.createdAt) }}
        </td>

        <!-- Updated At -->
        <td class="px-6 py-4 text-gray-500 text-sm">
          {{ formatTimeWithHoursWithoutTimeZone(category.updatedAt) }}
        </td>

        <!-- Actions -->
        <td class="px-6 py-4">
          <div class="flex items-center justify-end gap-2">
            <!-- Update -->
            <BaseButton
              @click="emit('update', category)"
              icon="pen"
              size="Small"
              mode="Secondary"
            />

            <!-- Delete -->
            <BaseButton
              @click="emit('delete', category)"
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
