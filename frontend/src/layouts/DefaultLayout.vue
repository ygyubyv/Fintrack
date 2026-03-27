<script setup lang="ts">
import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
import { useAuthStore } from "@/stores/auth/auth.store";
import { storeToRefs } from "pinia";
import BaseSpinner from "@/components/base/BaseSpinner.vue";

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
