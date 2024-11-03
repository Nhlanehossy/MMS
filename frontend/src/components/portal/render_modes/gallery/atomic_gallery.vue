<template>
  <div class="container mx-auto px-4">
    <h2 class="text-2xl font-bold mb-4"></h2>

    <div v-if="mode === 'default'">
      <!-- Default mode -->
      <lightgallery
        :settings="{ speed: 500, plugins: plugins }"
        :onInit="onInit"
        :onBeforeSlide="onBeforeSlide"
        :class="layoutClass"
      >
        <a
          v-for="(image, index) in images"
          :key="index"
          :href="image"
          class="relative overflow-hidden group flex-shrink-0"
          :style="imageWrapperStyle"
        >
          <div class="">
            <img
              :src="image"
              class="object-cover rounded-lg"
              :style="imageStyle"
            />
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 transition-opacity duration-300 group-hover:opacity-100 rounded-lg"
          >
            <span class="text-white text-lg font-semibold"
              ><i class="fa fa-eye"></i
            ></span>
          </div>
        </a>
      </lightgallery>
    </div>

    <div v-else-if="mode === 'carousel'">
      <!-- Carousel mode -->
      <lightgallery
        :settings="{
          speed: 500,
          plugins: plugins,
          mode: 'lg-slide',
          loop: true,
          slideEndAnimation: true,
        }"
        :onInit="onInit"
        :onBeforeSlide="onBeforeSlide"
      >
        <a
          v-for="(image, index) in images"
          :key="index"
          :href="image"
          class="relative overflow-hidden group"
        >
          <img
            :src="image"
            class="object-cover rounded-lg"
            :style="imageStyle"
          />
        </a>
      </lightgallery>
    </div>

    <div v-else-if="mode === 'slide'">
      <!-- Slide mode -->
      <lightgallery
        :settings="{
          speed: 500,
          plugins: plugins,
          mode: 'lg-slide',
          slideEndAnimation: true,
          counter: true,
        }"
        :onInit="onInit"
        :onBeforeSlide="onBeforeSlide"
      >
        <a
          v-for="(image, index) in images"
          :key="index"
          :href="image"
          class="relative overflow-hidden group"
        >
          <img
            :src="image"
            class="object-cover rounded-lg"
            :style="imageStyle"
          />
        </a>
      </lightgallery>
    </div>

    <div v-else-if="mode === 'main-thumbnail'">
      <!-- Main and Thumbnail mode -->
      <div class="flex flex-col md:flex-col">

    <img
      :src="mainImage"
      class="w-full mb-4"

    />

  <div>
    <lightgallery
      :settings="{
        speed: 500,
        plugins: plugins,
        counter: true,
        thumbContHeight: 100,
        toggleThumb: true,
      }"
      :onInit="onInit"
      :onAfterSlide="onAfterSlide"
      :class="thumbnailLayoutClass"
    >
      <a
        v-for="(image, index) in images"
        :key="index"
        :href="image"
        class="overflow-hidden"
      >
        <img
          :src="image"
          class="object-cover rounded-lg ml-2 mb-2 w-[9rem] h-[8rem]"
          :class="thumbnailImageClass"
        />
      </a>
    </lightgallery>
  </div>
</div>
    </div>
  </div>
</template>

<script>
import Lightgallery from "lightgallery/vue";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import DataFetcher from "../../../DataFetcher.vue";

// If you are using scss you can skip the css imports below and use scss instead
import "lightgallery/scss/lightgallery.scss";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

export default {
  props: {
    images: Array,
    layout: {
      type: String,
      default: "grid",
      validator: (value) => ["grid", "flex"].includes(value),
    },
    imageDimensions: {
      type: Object,
      default: () => ({
        width: "100%",
        height: "100%",
      }),
    },
    mode: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "carousel", "slide", "main-thumbnail"].includes(value),
    },
  },
  components: {
    Lightgallery,
    DataFetcher,
  },
  data() {
    return {
      plugins: [lgThumbnail, lgZoom],
      mainImage: this.images[0],
    };
  },
  computed: {
    layoutClass() {
      return {
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2":
          this.layout === "grid",
        "flex flex-wrap": this.layout === "flex",
      };
    },
    thumbnailLayoutClass() {
      return {
        "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2":
          this.layout === "grid",
        "flex flex-wrap": this.layout === "flex",
      };
    },
    thumbnailImageClass() {
      return {
        "h-20 w-full object-cover": true,
      };
    },
    imageStyle() {
      return {
        width: this.imageDimensions.width,
        height: this.imageDimensions.height,
      };
    },
    imageWrapperStyle() {
      return this.layout === "flex"
        ? {
            marginRight: "0.5rem", // Add some spacing between images
          }
        : {};
    },
  },
  methods: {
    onInit() {
      console.log("lightGallery has been initialized");
    },
    onBeforeSlide() {
      console.log("calling before slide");
    },
    onAfterSlide(event) {
      this.mainImage = event.detail.currentSlideObject.src;
    },
  },
};
</script>
