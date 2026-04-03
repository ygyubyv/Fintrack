<script setup lang="ts">
interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: "Track Expenses",
    description: "Easily log and manage your daily spending in seconds.",
    icon: "wallet",
  },
  {
    title: "Smart Categories",
    description: "Organize expenses with custom categories and tags.",
    icon: "folder",
  },
  {
    title: "Analytics & Charts",
    description: "Visualize your finances with powerful insights.",
    icon: "chart-bar",
  },
  {
    title: "Real-time Insights",
    description: "Instant overview of your financial habits.",
    icon: "bolt",
  },
];
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
    <!-- Header -->
    <div class="text-center mb-16">
      <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
        Everything you need
      </h2>
      <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
        Comprehensive tools to manage and analyze your finances effortlessly
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-md hover:border-neutral-200 transition-all duration-200 group"
      >
        <!-- Icon -->
        <div
          class="w-12 h-12 flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 mb-6 group-hover:bg-neutral-200 transition-colors duration-200"
        >
          <font-awesome-icon :icon="['fas', feature.icon]" class="text-xl" />
        </div>

        <!-- Content -->
        <h3 class="text-lg font-semibold text-neutral-900 mb-3">
          {{ feature.title }}
        </h3>
        <p class="text-sm text-neutral-600 leading-relaxed">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>
</template>
