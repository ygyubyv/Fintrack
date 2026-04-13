<script setup lang="ts">
import { useAuthStore } from "@/stores/auth/auth.store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const router = useRouter();
const authStore = useAuthStore();

const { isAuthenticated } = storeToRefs(authStore);

const handleSignUp = () => {
  if (!isAuthenticated.value) {
    router.push({ name: "auth" });
  }
};
</script>

<template>
  <section class="bg-neutral-100 py-24 lg:py-32 border-t border-neutral-200">
    <!-- Content -->
    <div class="max-w-4xl mx-auto px-6 text-center space-y-8">
      <h2 class="text-4xl lg:text-5xl font-bold leading-tight text-neutral-900">
        Start Managing Your Finances Today
      </h2>

      <p class="text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
        Join thousands of users who are taking control of their spending and
        building better financial habits.
      </p>

      <!-- Actions -->
      <div class="pt-4" v-if="!isAuthenticated">
        <!-- Sign Up -->
        <BaseButton
          text="Create Account"
          size="Big"
          mode="Primary"
          @click="handleSignUp"
        />
      </div>

      <!-- Icons -->
      <div
        class="pt-8 flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-neutral-600"
      >
        <div class="flex items-center gap-2">
          <FontAwesomeIcon
            :icon="['fas', 'check-circle']"
            class="text-neutral-700"
          />
          <span>No credit card required</span>
        </div>
        <div class="flex items-center gap-2">
          <FontAwesomeIcon
            :icon="['fas', 'check-circle']"
            class="text-neutral-700"
          />
          <span>Free to start</span>
        </div>
        <div class="flex items-center gap-2">
          <FontAwesomeIcon
            :icon="['fas', 'check-circle']"
            class="text-neutral-700"
          />
          <span>Risk-free</span>
        </div>
      </div>
    </div>
  </section>
</template>
