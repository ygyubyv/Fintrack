<template>
  <div>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  data: {
    labels: string[];
    values: number[];
  };
}

const props = defineProps<Props>();

const backgroundColor = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      data: props.data.values,
      borderWidth: 0,
      backgroundColor,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Categories Usage Chart",
    },
  },
};
</script>
