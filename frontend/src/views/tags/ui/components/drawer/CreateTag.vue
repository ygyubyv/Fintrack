<template>
  <BaseDrawer v-show="drawerIsVisible" @on-close="closeModal">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">Create Tag</h2>
    </template>

    <template #default>
      <div class="flex flex-col gap-3">
        <!-- Title -->
        <BaseInput
          label="Title"
          v-model="title"
          placeholder="Tag Title"
          v-bind="titleAttrs"
          :error="errors.title"
          id="tag-title"
          type="text"
          size="Medium"
        />

        <!-- Color -->
        <div class="flex flex-col gap-2 relative" ref="colorWrapperRef">
          <label class="mb-1 text-sm font-medium text-neutral-800">Color</label>

          <div
            class="w-18 h-10 border rounded cursor-pointer"
            :style="{ backgroundColor: color }"
            @click="pickerVisible = !pickerVisible"
          ></div>

          <div
            v-if="pickerVisible"
            class="absolute z-50 mt-1 left-0 shadow-lg border rounded"
          >
            <Vue3ColorPicker
              v-model:modelValue="color"
              type="HEX"
              mode="solid"
              :showPickerMode="false"
              :showAlpha="false"
              :showInputMenu="false"
              :showColorList="false"
            />
          </div>

          <p v-if="errors.color" class="mt-1 text-xs text-red-600">
            {{ errors.color }}
          </p>
        </div>
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
import { useCreateTagForm } from "../../../composables/validation/useCreateTagForm";
import type { ICreateTag } from "../../../types";
import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";

interface Props {
  drawerIsVisible: boolean;
}

interface Emits {
  (e: "update:drawerIsVisible", value: boolean): void;
  (e: "submit", tag: ICreateTag): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { title, titleAttrs, color, errors, meta, onSubmit, resetForm } =
  useCreateTagForm({ emit });

const pickerVisible = ref(false);

const colorWrapperRef = useTemplateRef("colorWrapperRef");

onClickOutside(colorWrapperRef, () => {
  pickerVisible.value = false;
});

const closeModal = () => {
  resetForm();
  pickerVisible.value = false;
  emit("update:drawerIsVisible", false);
};
</script>
