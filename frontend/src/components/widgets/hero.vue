<!-- Hero.vue -->
<template>
  <section data-aos="zoom-in" class="relative mt-12 border-b border-textLighter h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img :src="props.imageUrl" :alt="props.imageAlt" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
    </div>
    
    <div class="container mx-auto px-4 relative z-10 text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in-up text-center">
          {{ props.title }}
        </h1>
        <h2 class="text-xl md:text-2xl font-medium mb-10 opacity-90 animate-fade-in-up animation-delay-300 text-center">
          {{ props.subtitle }}
        </h2>

        <!-- Enhanced Search Form -->
        <span class="animate-fade-in-up animation-delay-600">
          <SearchBar />
        </span>
      </div>
    </div>
    
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent"></div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import SearchBar from './searchBar.vue';

const props = defineProps({
  title: String,
  subtitle: String,
  imageUrl: String,
  imageAlt: String,
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}
</style>