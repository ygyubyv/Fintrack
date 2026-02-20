import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/index.vue";
import Analytics from "@/pages/analytics.vue";
import Auth from "@/pages/auth.vue";
import Budgets from "@/pages/budgets.vue";
import Dashboard from "@/pages/dashboard.vue";
import Transactions from "@/pages/transactions.vue";
import { useAuthStore } from "@/stores/auth/auth.store";
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: Analytics,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth,
      meta: {
        requiresUnauth: true,
      },
    },
    {
      path: "/budgets",
      name: "budgets",
      component: Budgets,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/transactions",
      name: "transactions",
      component: Transactions,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const { bootstrap } = authStore;
  const { isAuthenticated } = storeToRefs(authStore);

  if (to.meta.requiresUnauth && isAuthenticated.value) {
    return { name: "main" };
  }

  // Await auth if page requires authenticated
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    await bootstrap();

    if (!isAuthenticated.value) {
      return { name: "auth" };
    }
  }

  // Async auth if page is public
  if (!to.meta.requiresAuth && !to.meta.requiresunauth) {
    bootstrap();
  }
});

export default router;
