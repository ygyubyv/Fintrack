<script setup lang="ts">
import type { AuthMode } from "../types";

import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import AuthSwitcher from "./components/AuthSwitcher.vue";
import ForgotPasswordForm from "./components/ForgotPasswordForm.vue";
import ResetPasswordForm from "./components/ResetPasswordForm.vue";
import VerifyEmailForm from "./components/VerifyEmailForm.vue";

import { useRouteQuery } from "@vueuse/router";

const mode = useRouteQuery<AuthMode>("mode", "login");

const currentComponent = computed(() => {
  switch (mode.value) {
    case "login":
      return LoginForm;

    case "register":
      return RegisterForm;

    case "forgot":
      return ForgotPasswordForm;

    case "reset":
      return ResetPasswordForm;

    case "verify-email":
      return VerifyEmailForm;
  }
});

const switchMode = (value: AuthMode) => {
  mode.value = value;
};
</script>

<template>
  <div class="flex items-center justify-center px-4">
    <div
      class="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
    >
      <AuthSwitcher :mode="mode" @change="switchMode" />

      <component :is="currentComponent" />
    </div>
  </div>
</template>
