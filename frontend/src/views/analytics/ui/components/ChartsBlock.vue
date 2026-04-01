<script setup lang="ts">
import type { IExpense } from "@/views/transactions/types";
import PaymentTypeChart from "./charts/PaymentTypeChart.vue";
import { computed } from "vue";
import ExpenseTypeChart from "./charts/ExpenseTypeChart.vue";
import ExpensesChart from "./charts/ExpensesChart.vue";

interface Props {
  items: IExpense[];
}

const props = defineProps<Props>();

const getExpenseDateLabel = (expense: IExpense) => {
  const expenseDate = new Date(expense.createdAt);

  const day = expenseDate.getDate();
  const month = expenseDate.getMonth() + 1;
  const year = expenseDate.getFullYear();

  return `${day}-${month}-${year}`;
};

const expensesChartData = computed(() => {
  const expenses = props.items.filter((item) => {
    return item.expenseType === "EXPENSE";
  });

  const expenseGroups: { label: string; value: number }[] = [];

  expenses.forEach((expense) => {
    const label = getExpenseDateLabel(expense);

    const targetGroupIndex = expenseGroups.findIndex((expenseGroup) => {
      return expenseGroup.label === label;
    });

    if (targetGroupIndex === -1) {
      expenseGroups.push({
        label,
        value: Number(expense.value),
      });
    } else {
      expenseGroups[targetGroupIndex]!.value += Number(expense.value);
    }
  });

  const labels = expenseGroups.map((expenseGroup) => {
    return expenseGroup.label;
  });

  const values = expenseGroups.map((expenseGroup) => {
    return expenseGroup.value;
  });

  return {
    labels,
    values,
  };
});

const paymentTypeChartData = computed(() => {
  const cardExpenses = props.items.reduce((accumulator, currentValue) => {
    if (
      currentValue.expenseType === "EXPENSE" &&
      currentValue.paymentType === "CARD"
    ) {
      return (accumulator += Number(currentValue.value));
    } else {
      return accumulator;
    }
  }, 0);

  const cashExpenses = props.items.reduce((accumulator, currentValue) => {
    if (
      currentValue.expenseType === "EXPENSE" &&
      currentValue.paymentType === "CASH"
    ) {
      return (accumulator += Number(currentValue.value));
    } else {
      return accumulator;
    }
  }, 0);

  const labels = ["Card", "Cash"];
  const values = [cardExpenses, cashExpenses];

  return {
    labels,
    values,
  };
});

const expenseTypeChartData = computed(() => {
  const expenses = props.items.reduce((accumulator, currentValue) => {
    if (currentValue.expenseType === "EXPENSE") {
      return (accumulator += Number(currentValue.value));
    } else {
      return accumulator;
    }
  }, 0);

  const incomes = props.items.reduce((accumulator, currentValue) => {
    if (currentValue.expenseType === "INCOME") {
      return (accumulator += Number(currentValue.value));
    } else {
      return accumulator;
    }
  }, 0);

  const labels = ["Expenses", "Incomes"];
  const values = [expenses, incomes];

  return {
    labels,
    values,
  };
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <!-- Expenses -->
    <div class="bg-white rounded-2xl shadow-sm p-4 h-120 lg:col-span-2">
      <ExpensesChart
        :data="{
          labels: expensesChartData.labels,
          values: expensesChartData.values,
        }"
      />
    </div>

    <!-- Card vs Cash -->
    <div class="bg-white rounded-2xl shadow-sm p-4 h-80">
      <PaymentTypeChart
        :data="{
          labels: paymentTypeChartData.labels,
          values: paymentTypeChartData.values,
        }"
      />
    </div>

    <!-- Income vs Expense -->
    <div class="bg-white rounded-2xl shadow-sm p-4 h-80">
      <ExpenseTypeChart
        :data="{
          labels: expenseTypeChartData.labels,
          values: expenseTypeChartData.values,
        }"
      />
    </div>
  </div>
</template>
