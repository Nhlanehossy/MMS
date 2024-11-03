<template>
  <a-layout-header class="...">
    <div class="flex items-center">
      <a-button v-if="!sidebarOpen" type="text" @click="toggleSidebar" class="...">...</a-button>
      <div v-if="sidebarMinified || !sidebarOpen" class="h-5 mt-0"></div>
    </div>
    <div class="flex items-center space-x-4">
      <notification_dropdown />
      <themeCustomizer />
      <LanguageSelector />
      <a-avatar :src="avatarUrl" :size="34" @click="openProfileDrawer" class="..." />
    </div>
  </a-layout-header>
</template>

<script setup>
import notification_dropdown from '../notification_dropdown.vue';
import themeCustomizer from '../../../theme-customizer.vue';
import LanguageSelector from '../../../language_selector.vue';
// Props for TopBar
defineProps(['sidebarOpen', 'toggleSidebar', 'avatarUrl', 'openProfileDrawer']);
</script>

