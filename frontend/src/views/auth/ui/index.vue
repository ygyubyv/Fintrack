<script setup lang="ts">
import { ref, computed } from "vue";
import type { AuthMode } from "../types";

import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import AuthSwitcher from "./components/AuthSwitcher.vue";

const mode = ref<AuthMode>("login");

const currentComponent = computed(() => {
  return mode.value === "login" ? LoginForm : RegisterForm;
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
