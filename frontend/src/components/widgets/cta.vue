<template>
  <section 
    data-aos="fade-up"
    class="py-24 overflow-hidden bg-cardDark"
  >
    <div class="container mx-auto px-4 text-center relative">
      <h2 
        data-aos="fade-up"
        data-aos-delay="100"
        class="text-4xl md:text-5xl font-extrabold mb-6"
      >
        {{ props.title }}
      </h2>
      <p 
        data-aos="fade-up"
        data-aos-delay="200"
        class="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
      >
        {{ props.description }}
      </p>
      <a 
        data-aos="fade-up"
        data-aos-delay="300"
        :href="props.button.link"
        class="py-4 px-8 rounded-full bg-textLight hover:bg-opacity-90 transition duration-300 inline-flex items-center text-lg relative overflow-hidden group"
      >
        <!-- ... button content ... -->
      </a>
    </div>
  </section>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: String,
  description: String,
  button: Object,
  backgroundColor: String
});

const sectionRef = ref(null);
const isVisible = ref(false);

const checkVisibility = () => {
  if (!sectionRef.value) return;
  
  const rect = sectionRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  if (rect.top <= windowHeight * 0.75 && rect.bottom >= 0) {
    isVisible.value = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', checkVisibility);
  checkVisibility();
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkVisibility);
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.container::before,
.container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s infinite ease-in-out;
}

.container::before {
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, var(--secondary-color) 0%, transparent 70%);
}

.container::after {
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
  animation-delay: -3s;
}
</style>