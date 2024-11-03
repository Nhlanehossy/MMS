<template>
  <div :class="[
    'bg-cardLight text-textLighter h-screen flex flex-col transition-all duration-300 border-r-[1.5px] border-textLighter',
    'fixed lg:static',
    sidebarOpen ? (sidebarMinified ? 'w-16' : 'w-64') : 'w-0',
    'z-10 overflow-visible',
  ]">
    <template v-if="sidebarOpen">
      <!-- Sidebar Header -->
      <div class="p-4 flex items-center justify-between">
        <div class="w-full flex justify-center" v-if="!sidebarMinified">
          <Logo />
        </div>
        <button @click="toggleSidebarMinified" class="...">...</button>
        <button @click="toggleSidebar" class="...">...</button>
      </div>
      <!-- Sidebar Links -->
      <nav class="flex-1 p-4 text-sm font-sans">
        <ul>
          <!-- Home link -->
          <RouterLink :to="{ path: `/${portalName}`, query: { myParam: myQueryParam } }" class="...">...</RouterLink>
          <!-- Dynamic Menu Items -->
          <template v-for="(group, groupName) in menuItems.reduce((acc, item) => { ... }, {})" :key="groupName">
            <!-- Ungrouped items -->
            <template v-if="groupName === 'ungrouped'">...</template>
            <!-- Grouped items -->
            <template v-else>...</template>
          </template>
        </ul>
      </nav>
    </template>
  </div>
</template>

<script setup>
import Logo from '../../../u_i/sf_logo.vue';
// Props and logic for Sidebar
defineProps(['sidebarOpen', 'sidebarMinified', 'toggleSidebar', 'toggleSidebarMinified', 'menuItems', 'portalName', 'myQueryParam', 'isActive', 'toggleMenuGroup', 'openMenuGroups', 'hoveredMenuGroup', 'hoveredSubmenu']);
</script>

