<template>
  <BaseDrawer v-show="drawerIsVisible" @on-close="closeModal">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Create Category</h2>
    </template>

    <template #default>
      <div class="flex flex-col gap-3">
        <!-- Title -->
        <BaseInput
          label="Title"
          v-model="title"
          placeholder="Category Title"
          v-bind="titleAttrs"
          :error="errors.title"
          id="category-title"
          type="text"
          size="Medium"
        />
      </div>
    </template>

    <!-- Actions -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <!-- Cancel -->
        <BaseButton
          icon="xmark"
          text="Cancel"
          mode="Muted"
          size="Medium"
          @click="closeModal"
        />

        <!-- Submit -->
        <BaseButton
          :disabled="!meta.valid"
          icon="check"
          type="submit"
          text="Create"
          mode="Primary"
          size="Medium"
          @click="onSubmit"
        />
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseDrawer from "@/components/base/BaseDrawer.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { useCreateCategoryForm } from "../../../composables/validation/useCreateCategoryForm";
import type { ICreateCategory } from "../../../types";

interface Props {
  drawerIsVisible: boolean;
}

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: ICreateCategory): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { title, titleAttrs, errors, meta, onSubmit, resetForm } =
  useCreateCategoryForm({ emit });

const closeModal = () => {
  resetForm();
  emit("update:drawerIsVisible", false);
};
</script>
