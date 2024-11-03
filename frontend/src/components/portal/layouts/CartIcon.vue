<template>
  <div class="relative cursor-pointer" @click="handleClick">
    <i class="fas fa-shopping-cart text-textLight text-lg"></i>
    <span v-if="itemCount > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-1">
      {{ itemCount }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  itemCount: {
    type: Number,
    required: true,
  },
});

const handleClick = () => {
  // Emit an event or handle the click to navigate to the cart page
  // For example, you can use the router to navigate to the cart page
  // router.push('/cart');
};
</script>

<style scoped>
/* Add any additional styles for the cart icon here */
</style>