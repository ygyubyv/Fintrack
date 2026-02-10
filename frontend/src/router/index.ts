import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/index.vue";
import Analytics from "@/pages/analytics.vue";
import Auth from "@/pages/auth.vue";
import Budgets from "@/pages/budgets.vue";
import Dashboard from "@/pages/dashboard.vue";
import Transactions from "@/pages/transactions.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
    },
    {
      path: "/analytics",
      name: "analytics",
      component: Analytics,
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth,
    },
    {
      path: "/budgets",
      name: "budgets",
      component: Budgets,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/transactions",
      name: "transactions",
      component: Transactions,
    },
  ],
});

export default router;
