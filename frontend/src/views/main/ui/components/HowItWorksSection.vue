<script setup lang="ts">
interface Step {
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    title: "Add Expenses",
    description: "Quickly log your transactions with details and amounts.",
    icon: "plus-circle",
  },
  {
    title: "Organize",
    description: "Categorize and tag your data for better tracking.",
    icon: "layer-group",
  },
  {
    title: "Analyze",
    description: "Get insights and improve your spending habits.",
    icon: "chart-line",
  },
];
</script>

<template>
  <section class="bg-white py-24 lg:py-32">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
          How It Works
        </h2>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
          Three simple steps to start managing your finances
        </p>
      </div>

      <!-- Steps Grid -->
      <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="flex flex-col items-center text-center space-y-6"
        >
          <!-- Step Number Circle -->
          <div class="relative">
            <div
              class="w-16 h-16 rounded-full bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"
            >
              <span class="text-2xl font-bold text-neutral-900">
                {{ index + 1 }}
              </span>
            </div>

            <!-- Connection Line -->
            <div
              v-if="index < steps.length - 1"
              class="hidden md:block absolute top-1/2 -right-full w-full h-1 bg-linear-to-r from-neutral-300 to-transparent"
            ></div>
          </div>

          <!-- Content -->
          <div>
            <!-- Step Title -->
            <h3 class="text-xl font-semibold text-neutral-900 mb-3">
              {{ step.title }}
            </h3>

            <!-- Step Description -->
            <p class="text-neutral-600 leading-relaxed max-w-xs">
              {{ step.description }}
            </p>
          </div>

          <!-- Icon -->
          <div class="text-neutral-400">
            <font-awesome-icon :icon="['fas', step.icon]" class="text-3xl" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
