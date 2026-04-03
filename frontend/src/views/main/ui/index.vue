<script setup lang="ts">
import HeroSection from "./components/HeroSection.vue";
import FeaturesSection from "./components/FeaturesSection.vue";
import HowItWorksSection from "./components/HowItWorksSection.vue";
import PreviewSection from "./components/PreviewSection.vue";
import CTASection from "./components/CTASection.vue";
</script>

<template>
  <div class="text-neutral-900 overflow-hidden">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <FeaturesSection />

    <!-- How It Works Section -->
    <HowItWorksSection />

    <!-- Preview Section -->
    <PreviewSection />

    <!-- Call To Action Section -->
    <CTASection />
  </div>
</template>
