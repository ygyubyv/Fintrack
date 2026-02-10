<script setup lang="ts">
import Header from "@/components/header/Header.vue";
import Footer from "@/components/footer/Footer.vue";
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-linear-to-br from-neutral-50 to-neutral-100 text-neutral-900"
  >
    <Header />

    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-8 py-6">
        <RouterView />
      </div>
    </main>

    <Footer />
  </div>
</template>
