<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { useForgotPasswordForm } from "../../composables/validation/useForgotPasswordForm";

const { email, emailAttrs, errors, meta, onSubmit, resetForm } =
  useForgotPasswordForm();
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <!-- Title -->
    <div class="space-y-1">
      <h2 class="text-xl font-semibold text-neutral-900">Forgot password?</h2>
      <p class="text-sm text-neutral-500">
        Enter your email and we'll send you a reset link.
      </p>
    </div>

    <!-- Email -->
    <BaseInput
      v-model="email"
      v-bind="emailAttrs"
      :error="errors.email"
      id="email"
      type="email"
      label="Email"
      placeholder="Enter your email"
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
        text="Send reset link"
        icon="paper-plane"
        size="Medium"
        mode="Primary"
        type="submit"
        :disabled="!meta.valid || !meta.dirty"
      />
    </div>
  </form>
</template>
