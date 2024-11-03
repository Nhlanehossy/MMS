<template>
    <section class="py-12 bg-gray-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4">{{ props.title }}</h2>
        <p class="text-xl text-center mb-12">{{ props.description }}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="plan in props.plans" :key="plan.name" :class="{'transform scale-105 z-10': plan.highlighted}" class="bg-white rounded-lg shadow-md overflow-hidden transition duration-300">
            <div :class="{'bg-secondary text-white': plan.highlighted, 'bg-gray-200': !plan.highlighted}" class="p-6">
              <h3 class="text-2xl font-semibold mb-2">{{ plan.name }}</h3>
              <p class="text-3xl font-bold">{{ plan.price }} <span class="text-base font-normal">{{ plan.period }}</span></p>
            </div>
            <div class="p-6">
              <ul class="mb-6">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center mb-2">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  {{ feature }}
                </li>
              </ul>
              <a :href="plan.button.link" :class="{'bg-secondary hover:bg-secondary': plan.highlighted, 'bg-gray-500 hover:bg-gray-600': !plan.highlighted}" class="block text-center text-white py-2 px-4 rounded transition duration-300">
                {{ plan.button.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps(['title', 'description', 'plans']);
  </script>