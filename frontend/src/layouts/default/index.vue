<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useAuthStore } from "@/stores/auth/auth.store";

const { isLoading } = storeToRefs(useAuthStore());
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-linear-to-br from-neutral-50 to-neutral-100 text-neutral-900"
  >
    <Header />

    <main class="flex flex-1 items-center justify-center">
      <div class="w-full max-w-7xl px-8 py-6">
        <RouterView v-show="!isLoading" />
        <BaseSpinner v-show="isLoading" mode="Black-spinner" />
      </div>
    </main>

    <Footer />
  </div>
</template>
