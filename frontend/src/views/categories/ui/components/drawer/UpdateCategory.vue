<template>
  <BaseDrawer v-show="drawerIsVisible" @on-close="closeModal">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Update Category</h2>
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
          text="Update"
          mode="Primary"
          size="Medium"
          @click="onSubmit"
        />
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { useUpdateCategoryForm } from "../../../composables/validation/useUpdateCategoryForm";
import type { ICategory, IUpdateCategory } from "../../../types";

interface Props {
  drawerIsVisible: boolean;
  initialValues: ICategory;
}

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", payload: IUpdateCategory): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { title, titleAttrs, errors, meta, onSubmit, resetForm, setForm } =
  useUpdateCategoryForm({ emit });

const closeModal = () => {
  resetForm();
  emit("update:drawerIsVisible", false);
};

watch(
  () => props.drawerIsVisible,
  (newValue) => {
    if (newValue) {
      setForm(props.initialValues);
    }
  },
  {
    immediate: true,
  },
);
</script>
