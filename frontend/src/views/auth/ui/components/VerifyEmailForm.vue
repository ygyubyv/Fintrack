<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import { useVerifyEmailForm } from "../../composables/validation/useVerifyEmailForm";
import OtpInput from "./OtpInput.vue";

const { code, meta, onSubmit, resetForm } = useVerifyEmailForm();
</script>

<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h2 class="text-xl font-semibold text-neutral-900">Verify your email</h2>

      <p class="text-sm text-neutral-500 leading-relaxed">
        We’ve sent a 6-digit verification code to your email address. Enter the
        code below to activate your account.
      </p>
    </div>

    <!-- OTP Input -->
    <OtpInput v-model="code" :length="6" />

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
        text="Confirm"
        icon="lock"
        size="Medium"
        mode="Primary"
        type="submit"
        :disabled="!meta.valid || !meta.dirty"
      />
    </div>
  </form>
</template>
