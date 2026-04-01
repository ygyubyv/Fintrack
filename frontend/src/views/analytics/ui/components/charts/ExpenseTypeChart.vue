<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { computed } from "vue";

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

interface Props {
  data: {
    labels: string[];
    values: number[];
  };
}

const props = defineProps<Props>();

const backgroundColor = ["#facc15", "#f87171"];

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      data: props.data.values,
      backgroundColor,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Expense Vs Income",
    },
    legend: {
      display: false,
    },
  },
};
</script>
