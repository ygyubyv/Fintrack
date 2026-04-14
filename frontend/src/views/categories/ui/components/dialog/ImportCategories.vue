<script setup lang="ts">
import type { IImportCategories } from "@/views/categories/types";
import { useImportCategoriesForm } from "@/views/categories/composables/validation/useImportCategoriesForm";

interface Props {
  dialogIsVisible: boolean;
}

interface Emits {
  (e: "submit", payload: IImportCategories): void;
  (e: "update:dialogIsVisible", value: boolean): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { file, errors, isFormValid, onSubmit, onClose, resetForm } =
  useImportCategoriesForm({ emit });

const fileInput = useTemplateRef("fileInput");

const onDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;

  if (files && files.length > 0) {
    file.value = Array.from(files)[0]!;
  }
};

const handleFileInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  const files = Array.from(input?.files || []);

  if (files.length && files.length > 0) {
    file.value = files[0]!;
  }
};
</script>

<template>
  <BaseDialog
    v-if="dialogIsVisible"
    title="Select file to import"
    @close="onClose"
  >
    <template #default>
      <div class="flex flex-col items-center gap-4 m-8">
        <!-- Drop zone -->
        <div
          class="w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200"
          :class="[
            errors.file
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100',
          ]"
          @drop.prevent="onDrop"
          @dragenter.prevent
          @dragover.prevent
        >
          <!-- Errors -->
          <p v-if="errors.file" class="text-xs text-red-500 mt-2 mb-4">
            {{ errors.file }}
          </p>

          <!-- Icon -->
          <font-awesome-icon
            :icon="['fas', 'file-arrow-up']"
            class="text-3xl text-gray-400 mb-3"
          />

          <!-- Text -->
          <p class="text-sm text-gray-600">Drag & drop your file here</p>
          <p class="text-xs text-gray-400">or</p>

          <!-- Upload -->
          <label class="mt-2">
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileInputChange"
            />
            <BaseButton
              text="Choose file"
              icon="plus"
              @click="() => fileInput?.click()"
            />
          </label>
        </div>

        <!-- Preview -->
        <div
          v-if="file"
          class="w-full flex items-center justify-between rounded-lg px-3 py-2 border"
          :class="
            errors.file
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-100'
          "
        >
          <span class="text-sm text-gray-700 truncate">
            {{ file.name }}
          </span>

          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="text-gray-400 cursor-pointer hover:text-black"
            @click="resetForm"
          />
        </div>
      </div>
    </template>

    <!-- Actions -->
    <template #footer>
      <!-- Close -->
      <BaseButton
        :on-click="onClose"
        icon="xmark"
        text="Cancel"
        mode="Secondary"
      />

      <!-- Submit -->
      <BaseButton
        icon="file-import"
        text="Import"
        mode="Primary"
        :disabled="!isFormValid"
        :on-click="onSubmit"
      />
    </template>
  </BaseDialog>
</template>
