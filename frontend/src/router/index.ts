import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/index.vue";
import Analytics from "@/pages/analytics.vue";
import Auth from "@/pages/auth.vue";
import Tags from "@/pages/tags.vue";
import Transactions from "@/pages/transactions.vue";
import { useAuthStore } from "@/stores/auth/auth.store";
import Categories from "@/pages/categories.vue";

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
      path: "/tags",
      name: "tags",
      component: Tags,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/categories",
      name: "categories",
      component: Categories,
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

  if (to.meta.requiresUnauth && isAuthenticated.value) {
    return { name: "main" };
  }
});

export default router;
