<template>
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {{ name }}
        </h2>
        <div
          class="flex font-sans justify-center w-full mt-4 font-bold text-5xl text-center"
        >
          <img src="../assets/images/seprator-D7WTKkbV.png" />
        </div>
        <p
          class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
          v-html="description"
        ></p>
      </div>

      <div class="mt-10">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="(image, index) in sampleImages"
            :key="index"
            class="relative transition-transform duration-500 ease-in-out transform hover:scale-105"
          >
            <div class="aspect-w-3 aspect-h-2">
              <img
                class="object-cover shadow-lg rounded-lg"
                :src="image"
                :alt="name"
              />
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 rounded-lg opacity-0 hover:opacity-75 transition-opacity duration-500"
            ></div>
          </div>
        </div>
      </div>

      <div class="mt-10 text-center">
        <router-link
          :to="`/gallery/${id}`"
          class="inline-block bg-webPrimary border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
        >
          Explore Gallery
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sampleImages: [],
      hoverEffectInterval: null,
    };
  },
  mounted() {
    this.sampleImages = this.getRandomImages(3);
  },
  methods: {
    getRandomImages(count) {
      const shuffled = this.images.slice().sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
  },
};
</script>
