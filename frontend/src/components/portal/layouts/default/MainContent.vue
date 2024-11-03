<template>
  <div class="flex-1 shadow-inner bg-background overflow-y-auto transition-all duration-300">
    <transition name="slide-fade" mode="out-in">
      <div>
        <breadcrumbs />
        <slot />
      </div>
    </transition>
    <transition name="slide-fade">
      <a-drawer v-model:visible="profileDrawerOpen" :closable="false" placement="right" :width="450" class="...">
        <div class="profile-content">...</div>
      </a-drawer>
    </transition>
  </div>
</template>

<script setup>
// Props for MainContent
defineProps(['portalName', 'translationKeys']);
</script>

