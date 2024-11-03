<template>
    <section class="py-12 bg-cardDark">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <img :src="props.imageUrl" :alt="props.author" class="w-24 h-24 rounded-full mx-auto mb-6 object-cover" />
          <blockquote class="text-2xl italic text-text mb-6">"{{ props.quote }}"</blockquote>
          <p class="font-semibold text-lg">{{ props.author }}</p>
          <p class="text-textLight">{{ props.position }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const props = defineProps(['quote', 'author', 'position', 'imageUrl']);
  </script>