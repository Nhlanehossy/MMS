<template>
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">{{ props.title }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="image in props.images" :key="image.alt" class="relative group">
            <img :src="image.url" :alt="image.alt" class="w-full h-64 object-cover rounded-lg" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <p class="text-white text-lg font-semibold">{{ image.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps(['title', 'images']);
  </script>