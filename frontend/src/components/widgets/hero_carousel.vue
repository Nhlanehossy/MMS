<template>
  <section class="relative mt-16 md:mt-24 h-[80vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <Carousel v-model="currentSlideIndex" :items="props.carouselItems" :wrap-around="true" :autoplay="5000">
        <Slide v-for="(item, index) in props.carouselItems" :key="index">
          <div class="w-full h-full">
            <img :src="item.imageUrl" :alt="item.imageAlt" class="w-full h-full object-right-bottom">
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          </div>
        </Slide>
      </Carousel>
    </div>
    <div class="absolute inset-0 bg-black/50 z-20"></div> <!-- New overlay for text visibility -->
    <div class="container mx-auto px-4 relative z-30 text-white">
      <div class="max-w-3xl mx-auto" :class="layoutClass">
        <h1 data-aos="fade-up" data-aos-delay="0" class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
          {{ currentSlide.title }}
        </h1>
        <h2 data-aos="fade-up" data-aos-delay="100" class="text-lg sm:text-xl md:text-2xl font-medium mb-4 md:mb-6 opacity-90">
          {{ currentSlide.subtitle }}s
        </h2>
        <p v-if="currentSlide.description" data-aos="fade-up" data-aos-delay="200" class="text-base md:text-lg mb-6 md:mb-10 opacity-80">
          {{ currentSlide.description }}
        </p>
        <a data-aos="fade-up" data-aos-delay="300" :href="currentSlide.button.link" class="bg-secondary text-text hover:bg-opacity-90 font-bold py-3 px-6 md:py-4 md:px-8 rounded-full transition duration-300 inline-flex items-center group">
          <i :class="currentSlide.button.icon" class="mr-2 transform group-hover:translate-x-1 transition-transform"></i>
          {{ currentSlide.button.label }}
        </a>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-black/70 to-transparent"></div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';

const props = defineProps({
  carouselItems: {
    type: Array,
    required: true,
  },
  layout: {
    type: String,
    default: 'center',
  },
});

const currentSlideIndex = ref(0);

const currentSlide = computed(() => props.carouselItems[currentSlideIndex.value]);

const layoutClass = computed(() => {
  switch (props.layout) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
});
</script>

<style scoped>
/* Remove existing keyframes and animation styles */
</style>
