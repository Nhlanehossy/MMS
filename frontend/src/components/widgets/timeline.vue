<template>
    <section class="py-12 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ props.title }}</h2>
        <div class="relative">
          <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-secondary"></div>
          <div v-for="(event, index) in props.events" :key="event.year" :class="{'md:flex-row-reverse': index % 2 !== 0}" class="flex flex-col md:flex-row items-center mb-8">
            <div class="md:w-1/2 mb-4 md:mb-0">
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
                <p class="text-gray-600">{{ event.description }}</p>
              </div>
            </div>
            <div class="md:w-1/2 flex justify-center">
              <div class="bg-secondary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold z-10">
                {{ event.year }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps(['title', 'events']);
  </script>