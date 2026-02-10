<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import BaseButton from "../base/BaseButton.vue";
import Burger from "./Burger.vue";

const route = useRoute();

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Transactions", to: "/transactions" },
  { label: "Analytics", to: "/analytics" },
  { label: "Budgets", to: "/budgets" },
];

const isAuthenticated = false;
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
          v-for="link in links"
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
          ></span>
        </RouterLink>

        <div class="ml-2">
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
            />
          </template>
        </div>
      </nav>

      <!-- Mobile -->
      <div class="sm:hidden">
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
          <Burger :links="links" />
        </template>
      </div>
    </div>
  </header>
</template>
