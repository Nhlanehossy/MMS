<template>
  <section class="py-24 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-16 text-gray-800 relative">
        <span class="mb-4 inline-block">{{ props.title }}</span>
        <span class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary rounded-full"></span>
      </h2>
      <div class="flex flex-wrap justify-center gap-12">
        <div
          v-for="(member, index) in props.members"
          :key="member.name"
          class="text-center transform transition duration-500 hover:-translate-y-2 w-full max-w-xs"
          :class="{'animate-fade-in-up': true}"
          :style="`animation-delay: ${index * 150}ms`"
        >
          <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition duration-300">
            <img
              :src="member.imageUrl"
              :alt="member.name"
              class="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-md transition duration-300 transform hover:scale-105"
            />
            <h3 class="text-2xl font-semibold mb-2 text-gray-800">{{ member.name }}</h3>
            <p class="text-gray-600 mb-6">{{ member.position }}</p>
            <div class="flex justify-center">
              
               <a v-for="link in member.socialLinks"
                :key="link.platform"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-secondary transition duration-300 mx-2"
              >
                <i :class="getSocialIcon(link.platform)" class="text-2xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps(['title', 'members']);

const getSocialIcon = (platform) => {
  const icons = {
    linkedin: 'fab fa-linkedin',
    twitter: 'fab fa-twitter',
    github: 'fab fa-github',
    facebook: 'fab fa-facebook',
    instagram: 'fab fa-instagram',
  };
  return icons[platform] || 'fas fa-globe';
};

onMounted(() => {
  // Smooth scroll functionality (if needed)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>