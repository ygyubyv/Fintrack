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
    colors: string[];
  };
}

const props = defineProps<Props>();

const chartData = computed(() => ({
  labels: props.data.labels,
  datasets: [
    {
      data: props.data.values,
      borderWidth: 0,
      backgroundColor: props.data.colors,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Tags Usage Chart",
    },
  },
};
</script>
