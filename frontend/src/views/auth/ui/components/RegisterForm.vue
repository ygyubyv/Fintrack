<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import { GoogleSignInButton } from "vue3-google-signin";
import { useSignupForm } from "../../composables/validation/useSignupForm";

const {
  firstName,
  firstNameAttrs,
  lastName,
  lastNameAttrs,
  email,
  emailAttrs,
  password,
  passwordAttrs,
  errors,
  meta,
  onSubmit,
  resetForm,
  handleGoogleAuth,
} = useSignupForm();
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <!-- First Name -->
    <BaseInput
      v-model="firstName"
      v-bind="firstNameAttrs"
      :error="errors.firstName"
      id="firstName"
      label="First name"
      placeholder="Enter your first name"
    />

    <!-- Last Name -->
    <BaseInput
      v-model="lastName"
      v-bind="lastNameAttrs"
      :error="errors.lastName"
      id="lastName"
      label="Last name"
      placeholder="Enter your last name"
    />

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
        text="Create account"
        icon="user-plus"
        size="Medium"
        mode="Primary"
        type="submit"
        :disabled="!meta.valid || !meta.dirty"
        @click="onSubmit"
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
