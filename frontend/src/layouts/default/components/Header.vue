<script setup lang="ts">
import Burger from "./Burger.vue";
import { useAuthStore } from "@/stores/auth/auth.store";

const route = useRoute();

const authStore = useAuthStore();
const { logout } = authStore;
const { isAuthenticated, isLoading } = storeToRefs(authStore);

const links = [
  { label: "Analytics", to: "/analytics", requiresAuth: true },
  { label: "Transactions", to: "/transactions", requiresAuth: true },
  { label: "Tags", to: "/tags", requiresAuth: true },
  { label: "Categories", to: "/categories", requiresAuth: true },
];

const visibleLinks = computed(() => {
  return links.filter((link) => {
    if (link.requiresAuth && !isAuthenticated.value) {
      return false;
    }
    return true;
  });
});
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <!-- Logo -->
      <RouterLink to="/" class="text-base font-semibold tracking-tight">
        FinTrack
      </RouterLink>

      <!-- Desktop navigation -->
      <nav class="hidden sm:flex items-center gap-4">
        <RouterLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          class="relative px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 group"
        >
          {{ link.label }}
          <span
            class="absolute bottom-0 left-0 h-0.5 w-full bg-black transform scale-x-0 origin-center transition-transform duration-300"
            :class="
              route.path === link.to ? 'scale-x-100' : 'group-hover:scale-x-100'
            "
          />
        </RouterLink>

        <div v-if="!isLoading" class="ml-2">
          <!-- Login -->
          <template v-if="!isAuthenticated">
            <RouterLink to="/auth">
              <BaseButton
                text="Login"
                icon="right-to-bracket"
                mode="Primary"
                size="Small"
              />
            </RouterLink>
          </template>

          <!-- Logout -->
          <template v-else>
            <BaseButton
              text="Logout"
              icon="right-from-bracket"
              mode="Secondary"
              size="Small"
              :on-click="logout"
            />
          </template>
        </div>
      </nav>

      <!-- Mobile -->
      <div v-if="!isLoading" class="sm:hidden">
        <template v-if="!isAuthenticated">
          <!-- Login -->
          <RouterLink to="/auth">
            <BaseButton
              text="Login"
              icon="right-to-bracket"
              mode="Primary"
              size="Small"
            />
          </RouterLink>
        </template>
        <template v-else>
          <!-- Burger -->
          <Burger
            :links="visibleLinks"
            :is-authenticated="isAuthenticated"
            @logout="logout"
          />
        </template>
      </div>
    </div>
  </header>
</template>
