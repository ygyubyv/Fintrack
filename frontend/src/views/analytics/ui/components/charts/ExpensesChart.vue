<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { CURRENCY } from "@/constants";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "vue-chartjs";
import type { TooltipItem } from "chart.js";

interface Props {
  data: {
    labels: string[];
    values: number[];
  };
}

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

const props = defineProps<Props>();

const chartData = computed(() => {
  return {
    labels: props.data.labels,
    datasets: [
      {
        data: props.data.values,
        fill: false,
        borderColor: "#364153",
        tension: 0.2,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<"line">) => {
          const value = context.raw as number;

          return `Spent: ${value.toFixed(2)} ${CURRENCY}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: window.innerWidth < 640 ? 6 : 12,
      },
    },
    y: {
      ticks: {
        precision: 0,
      },
    },
  },
};
</script>
