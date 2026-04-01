<template>
  <div class="space-y-6 animate-pulse p-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div class="h-6 w-32 bg-gray-200 rounded"></div>
      <div class="h-8 w-40 bg-gray-200 rounded"></div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-4 space-y-3">
        <div class="h-4 w-24 bg-gray-200 rounded"></div>
        <div class="h-6 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- Categories + Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Categories -->
      <div class="bg-white rounded-2xl p-4 space-y-3">
        <div class="h-5 w-32 bg-gray-200 rounded mb-2"></div>
        <div v-for="i in 5" :key="i" class="flex justify-between items-center">
          <div class="h-3 w-24 bg-gray-200 rounded"></div>
          <div class="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Chart -->
      <div class="bg-white rounded-2xl p-4 col-span-2">
        <div class="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        <div class="h-40 bg-gray-100 rounded"></div>
      </div>
    </div>

    <!-- Tags + Chart-->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="bg-white rounded-2xl p-4 h-40"></div>
      <div class="bg-white rounded-2xl p-4 h-40"></div>
    </div>
  </div>
</template>
