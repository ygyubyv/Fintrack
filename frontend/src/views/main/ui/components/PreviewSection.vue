<template>
  <section class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
    <!-- Header -->
    <div class="text-center mb-16">
      <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
        See It In Action
      </h2>
      <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
        Experience the complete dashboard with real-time analytics and expense
        tracking
      </p>
    </div>

    <!-- Card -->
    <div
      class="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
    >
      <div class="p-8 lg:p-12">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-8 border-b border-neutral-200"
        >
          <div>
            <div class="h-2 bg-neutral-200 rounded w-32 mb-2"></div>
            <div class="h-1.5 bg-neutral-100 rounded w-48"></div>
          </div>
          <div class="flex gap-3">
            <div class="h-9 w-20 bg-neutral-100 rounded-lg"></div>
            <div class="h-9 w-20 bg-neutral-100 rounded-lg"></div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            v-for="i in 4"
            :key="i"
            class="bg-neutral-50 border border-neutral-100 rounded-lg p-4"
          >
            <div class="h-1.5 bg-neutral-200 rounded w-16 mb-3"></div>
            <div class="h-2 bg-neutral-300 rounded w-24"></div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-neutral-50 border border-neutral-100 rounded-lg p-8">
          <div class="h-2 bg-neutral-200 rounded w-40 mb-6"></div>

          <!-- Bar Chart -->
          <div class="flex items-end justify-around gap-3 h-48">
            <div
              v-for="(day, i) in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']"
              :key="i"
              class="flex-1 flex flex-col items-center justify-end"
            >
              <div
                :style="{ height: `${40 + i * 12}px` }"
                class="w-full bg-neutral-300 rounded-t-lg"
              ></div>
              <div class="mt-3 text-xs text-neutral-500 font-medium">
                {{ day }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
