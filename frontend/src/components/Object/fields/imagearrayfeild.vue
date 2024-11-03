<template>
  <div class="carousel-wrapper">
    <div 
      class="carousel-inner"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div 
        v-for="(image, index) in value" 
        :key="index" 
        class="slide"
      >
        <div class="image-wrapper">
          <img 
            :src="image" 
            :alt="`Image ${index + 1}`" 
          />
        </div>
      </div>
    </div>
    
    <div class="dots">
      <div 
        v-for="(_, index) in value" 
        :key="index"
        class="dot"
        :class="{ 'active': currentIndex === index }"
      ></div>
    </div>
  </div>
</template>
 
 <script>
 export default {
  name: 'ImageArrayField',
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentIndex: 0,
      intervalId: null
    }
  },
  mounted() {
    this.startAutoplay();
  },
  beforeUnmount() {
    this.stopAutoplay();
  },
  methods: {
    startAutoplay() {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.value.length;
      }, 3000);
    },
    stopAutoplay() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  }
 };
 </script>
 
 <style scoped>
.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
}

.carousel-inner {
  display: flex;
  height: 100%;
  width: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  height: 100%;
  flex: 0 0 100%;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.dots {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.3s ease;
}

.dot.active {
  background-color: rgba(255, 255, 255, 1);
}
</style>