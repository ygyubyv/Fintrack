<script setup lang="ts">
import HeroImage from "@/assets/images/HeroImage.jpg";
import { useAuthStore } from "@/stores/auth/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);

const handleGetStarted = () => {
  if (!isAuthenticated.value) {
    router.push({ name: "auth" });
  } else {
    router.push({ name: "analytics" });
  }
};

const handleLogin = () => {
  if (!isAuthenticated.value) {
    router.push({ name: "auth" });
  }
};
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0"></div>

    <!-- Content -->
    <div
      class="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center"
    >
      <!-- Text Section -->
      <div class="space-y-8">
        <h1
          class="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight"
        >
          Take Control of Your Finances
        </h1>

        <p class="text-lg text-neutral-600 leading-relaxed max-w-lg">
          Track your expenses, understand your habits, and make smarter
          financial decisions — all in one place.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <!-- Get Started -->
          <BaseButton
            text="Get Started"
            size="Big"
            mode="Primary"
            @click="handleGetStarted"
          />

          <!-- Login -->
          <BaseButton
            text="Login"
            size="Big"
            mode="Secondary"
            v-if="!isAuthenticated"
            @click="handleLogin"
          />
        </div>
      </div>

      <!-- Image Section -->
      <div class="relative hidden lg:block">
        <img
          :src="HeroImage"
          alt="Financial Dashboard Preview"
          class="rounded-2xl shadow-sm border border-neutral-200 object-cover h-96 w-full"
        />
      </div>
    </div>
  </section>
</template>
