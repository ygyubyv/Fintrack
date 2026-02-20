<script setup lang="ts">
import axiosInstance from "@/plugins/axios.plugin";
import { onMounted } from "vue";

const privateHttp = async () => {
  await axiosInstance.get("/protected");
};

onMounted(privateHttp);
</script>
<template>Budgets</template>
