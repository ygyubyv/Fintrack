<script setup lang="ts">
import { GoogleSignInButton } from "vue3-google-signin";

import { useLoginForm } from "../../composables/validation/useLoginForm";

const {
  email,
  emailAttrs,
  password,
  passwordAttrs,
  errors,
  meta,
  onSubmit,
  resetForm,
  handleGoogleAuth,
} = useLoginForm();
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
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

    <!-- Password -->
    <div class="space-y-1">
      <BaseInput
        v-model="password"
        v-bind="passwordAttrs"
        :error="errors.password"
        id="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
      />

      <!-- Forgot password link -->
      <div class="flex justify-end">
        <RouterLink
          :to="{ name: 'auth', query: { mode: 'forgot' } }"
          class="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition"
        >
          Forgot password?
        </RouterLink>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 mt-6">
      <BaseButton
        v-if="meta.dirty"
        text="Reset"
        size="Medium"
        mode="Secondary"
        @click="resetForm"
      />

      <BaseButton
        text="Login"
        icon="right-to-bracket"
        size="Medium"
        mode="Primary"
        type="submit"
        :disabled="!meta.valid || !meta.dirty"
      />
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-4 my-6">
      <div class="flex-1 h-px bg-gray-200" />
      <span class="text-sm text-gray-400">OR</span>
      <div class="flex-1 h-px bg-gray-200" />
    </div>

    <!-- Google Button -->
    <div class="flex justify-center">
      <GoogleSignInButton @success="handleGoogleAuth"></GoogleSignInButton>
    </div>
  </form>
</template>
