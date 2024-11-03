<template>
  <div data-aos="zoom-in" class="max-w-screen-lg mx-auto mt-10 md:mt-16">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 text-center">{{ type }}</h2>
    <Carousel
      :items-to-show="itemsToShow"
      :wrap-around="true"
      class="relative overflow-hidden"
      v-if="filteredProducts.length"
    >
      <Slide v-for="product in filteredProducts" :key="product.id" class="p-2 sm:p-4">
        <div class="bg-cardDark shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300">
          <img
            :src="product.images[0]"
            :alt="product.name"
            class="w-full h-48 sm:h-56 object-cover rounded-t-lg"
          />
          <div class="p-4">
            <h3 class="text-lg md:text-xl font-semibold">{{ product.name }}</h3>
            <p class="text-gray-500 mt-1 text-sm md:text-base">{{ product.description }}</p>
            <div class="mt-2">
              <span class="text-xl font-bold text-secondary">MWK{{ product.price }}</span>
              <span v-if="product.discount_percentage" class="ml-2 text-sm line-through text-gray-400">MWK{{ discountedPrice(product) }}</span>
            </div>
          </div>
        </div>
      </Slide>
    </Carousel>
    <Pagination />
    <Navigation />
  </div>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import products from '@/assets/data/product.json';

export default {
  name: 'FeaturedProducts',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  data() {
    return {
      products
    };
  },
  computed: {
    filteredProducts() {
      switch (this.type) {
        case 'Top-Rated Products':
          return this.products.filter(product => product.rating >= 4.5);
        case 'New Arrivals':
          return this.products.sort((a, b) => new Date(b.time_added) - new Date(a.time_added));
        case 'Trending Products':
          return this.products.sort((a, b) => b.views_count - a.views_count);
        case 'Highly Discounted Products':
          return this.products.filter(product => product.discount_percentage >= 10);
        case 'Most Viewed Products':
          return this.products.sort((a, b) => b.views_count - a.views_count);
        case 'Best Value for Money':
          return this.products.sort((a, b) => (b.rating / b.price) - (a.rating / a.price));
        default:
          return this.products;
      }
    },
    itemsToShow() {
      // Set items to show based on screen width
      if (window.innerWidth < 640) {
        return 1; // Small screens (sm)
      } else if (window.innerWidth < 768) {
        return 2; // Medium screens (md)
      } else {
        return 3; // Large screens (lg)
      }
    }
  },
  methods: {
    discountedPrice(product) {
      return (product.price * (1 - product.discount_percentage / 100)).toFixed(2);
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateItemsToShow);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateItemsToShow);
  },
  methods: {
    updateItemsToShow() {
      this.$forceUpdate(); // Force reactivity for the computed property
    },
    discountedPrice(product) {
      return (product.price * (1 - product.discount_percentage / 100)).toFixed(2);
    }
  }
};
</script>

<style scoped>
.carousel__slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
