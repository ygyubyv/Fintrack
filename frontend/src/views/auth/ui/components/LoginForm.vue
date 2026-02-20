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
    <BaseInput
      v-model="password"
      v-bind="passwordAttrs"
      :error="errors.password"
      id="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
    />

    <!-- Actions -->
    <div class="flex justify-end gap-3 mt-6">
      <!-- Reset Form -->
      <BaseButton
        v-if="meta.dirty"
        text="Reset"
        size="Medium"
        mode="Secondary"
        @click="resetForm"
      />

      <!-- Submit -->
      <BaseButton
        text="Login"
        icon="right-to-bracket"
        size="Medium"
        mode="Primary"
        type="submit"
        :disabled="!meta.valid || !meta.dirty"
        @click="onSubmit"
      />
    </div>
  </form>
</template>
