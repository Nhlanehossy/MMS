<template>
  <section data-aos="zoom-in" class="py-12 bg-gray-100">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-8">{{ props.title }}</h2>
      <a-carousel :autoplay="props.autoplay" :autoplaySpeed="props.interval">
        <div v-for="item in props.items" :key="item.title">
          <div class="bg-white rounded-lg shadow-md overflow-hidden mx-2">
            <img :src="item.imageUrl" :alt="item.title" class="w-full h-64 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ item.title }}</h3>
              <p class="text-gray-600 mb-4">{{ item.description }}</p>
              <a :href="item.button.link" class="inline-block bg-secondary text-white px-4 py-2 rounded hover:bg-secondary transition duration-300">
                {{ item.button.label }}
              </a>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>
  </section>
</template>

<script setup>
import { Carousel as ACarousel } from 'ant-design-vue';

const props = defineProps({
  title: String,
  items: Array,
  autoplay: Boolean,
  interval: Number
});
</script>

<style scoped>
/* You may need to adjust these styles based on your specific requirements */
:deep(.ant-carousel .slick-slide) {
  text-align: center;
  overflow: hidden;
}

:deep(.ant-carousel .slick-arrow.slick-prev),
:deep(.ant-carousel .slick-arrow.slick-next) {
  font-size: 20px;
  color: #000;
}

:deep(.ant-carousel .slick-arrow.slick-prev) {
  left: 10px;
  z-index: 2;
}

:deep(.ant-carousel .slick-arrow.slick-next) {
  right: 10px;
  z-index: 2;
}
</style>