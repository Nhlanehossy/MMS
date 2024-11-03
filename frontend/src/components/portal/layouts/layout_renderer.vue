<script setup>
import { defineProps, computed } from 'vue';
import { RouterView } from 'vue-router';
import { useThemeManager } from '../../../executables/themeManager';
import webLayout from './web_layout.vue';
import userLayout from './user_layout.vue';
import DefaultLayout from './default_layout.vue';
import hoverableLayout from './hoverable_layout.vue';
import DrawerLayout from './drawer_layout.vue';

useThemeManager();

// Define the 'layout' prop
const props = defineProps({
  layout: {
    type: String,
    default: 'default', // Set the default layout to 'default'
  },
});

// Compute the layout component based on the 'layout' prop
const layoutComponent = computed(() => {
  switch (props.layout) {
    case 'web':
      return webLayout;
    case 'user':
      return userLayout;
    case 'hoverable':
      return hoverableLayout;
    case 'drawer':
      return DrawerLayout;
    default:
      return DefaultLayout;
  }
});
</script>

<template>
  <!-- Dynamically render the layout component based on the prop -->
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>
