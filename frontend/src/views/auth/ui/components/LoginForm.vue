<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
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
  </form>
</template>
