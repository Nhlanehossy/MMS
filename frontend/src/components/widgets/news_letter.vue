<template>
  <section 
  data-aos="zoom-in"
    :class="`py-20 ${props.backgroundColor} overflow-hidden`"
    ref="sectionRef"
  >
    <div class="container mx-auto px-4 relative">
      <div 
        class="max-w-2xl mx-auto text-center opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
        :class="{ 'opacity-100 translate-y-0': isVisible }"
      >
        <h2 class="text-4xl md:text-5xl font-extrabold mb-6 relative inline-block">
          {{ props.title }}
          <span class="absolute bottom-0 left-0 w-full h-1 bg-secondary transform scale-x-0 transition-transform duration-500 origin-left" :class="{ 'scale-x-100': isVisible }"></span>
        </h2>
        <p class="text-xl md:text-2xl mb-10">{{ props.description }}</p>
        <form @submit.prevent="submitForm" class="flex flex-col md:flex-row gap-4 relative">
          <input 
            type="email" 
            :placeholder="props.placeholder" 
            v-model="email" 
            required 
            class="flex-grow px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary text-lg transition-all duration-300 shadow-md hover:shadow-lg"
          />
          <button 
            type="submit" 
            class="bg-secondary text-white px-8 py-4 rounded-full hover:bg-opacity-90 transition duration-300 text-lg font-semibold relative overflow-hidden group shadow-md hover:shadow-lg"
          >
            <span class="absolute inset-0 w-full h-full transition duration-300 transform scale-x-0 origin-left bg-white group-hover:scale-x-100"></span>
            <span class="relative z-10 flex items-center justify-center">
              {{ props.buttonLabel }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps(['title', 'description', 'buttonLabel', 'placeholder', 'backgroundColor']);
const email = ref('');
const sectionRef = ref(null);
const isVisible = ref(false);

const submitForm = () => {
  // Implement form submission logic here
  console.log('Submitted email:', email.value);
  email.value = '';
};

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
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.container::before,
.container::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  opacity: 0.1;
  animation: float 10s infinite ease-in-out;
}

.container::before {
  top: -50px;
  left: -100px;
  background: radial-gradient(circle, var(--secondary-color) 0%, transparent 70%);
}

.container::after {
  bottom: -100px;
  right: -50px;
  background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
  animation-delay: -5s;
}

input::placeholder {
  transition: opacity 0.3s ease;
}

input:focus::placeholder {
  opacity: 0.5;
}

.bg-secondary {
  position: relative;
  z-index: 1;
}

.bg-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: brightness(0.9);
  z-index: -1;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.bg-secondary:hover::before {
  opacity: 1;
}
</style>