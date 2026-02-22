<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { useResetPasswordForm } from "../../composables/validation/useResetPasswordForm";

const { password, passwordAttrs, errors, meta, onSubmit, resetForm } =
  useResetPasswordForm();
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <!-- Title -->
    <div class="space-y-1">
      <h2 class="text-xl font-semibold text-neutral-900">Reset password</h2>
      <p class="text-sm text-neutral-500">Enter your new password below.</p>
    </div>

    <!-- Password -->
    <BaseInput
      v-model="password"
      v-bind="passwordAttrs"
      :error="errors.password"
      id="password"
      type="password"
      label="New password"
      placeholder="Enter new password"
    />

    <!-- Actions -->
    <div class="flex justify-end gap-3 mt-6">
      <!-- Reset -->
      <BaseButton
        v-if="meta.dirty"
        text="Reset"
        size="Medium"
        mode="Secondary"
        @click="resetForm"
      />

      <!-- Submit -->
      <BaseButton
        text="Update password"
        icon="key"
        size="Medium"
        mode="Primary"
        type="submit"
        :disabled="!meta.valid || !meta.dirty"
      />
    </div>
  </form>
</template>
