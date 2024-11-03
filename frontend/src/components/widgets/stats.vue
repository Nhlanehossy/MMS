<template>
    <section class="py-12 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ props.title }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="stat in props.stats" :key="stat.label" class="text-center">
            <i :class="stat.icon" class="text-4xl text-secondary mb-4"></i>
            <p class="text-5xl font-bold mb-2">{{ stat.value }}</p>
            <p class="text-xl text-gray-600">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps(['title', 'stats']);
  </script>