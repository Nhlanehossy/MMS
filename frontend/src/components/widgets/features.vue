<template>
    <section class="bg-cardLight py-16">
      <div class="container mx-auto px-4">
        <h2 data-aos="fade-up" class="text-3xl font-bold text-center mb-12">{{ props.title }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in props.features" 
            :key="feature.title" 
            data-aos="fade-up"
            :data-aos-delay="index * 100"
            class="text-center"
          >
            <i :class="feature.icon" class="text-4xl text-secondary mb-4"></i>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps({
    title: String,
    features: Array
  })
  </script>