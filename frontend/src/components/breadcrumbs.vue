<template>
  <nav v-if="!hideBreadcrumbs" aria-label="breadcrumb" class="breadcrumb-container">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item home-icon">
        <router-link to="/" class="hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </router-link>
      </li>
      <li 
        v-for="(crumb, index) in breadcrumbs" 
        :key="crumb.path"
        class="breadcrumb-item"
        :class="{ 'active': index === breadcrumbs.length - 1 }"
      >
        <router-link 
          :to="crumb.path"
          class="breadcrumb-link"
          :class="index === breadcrumbs.length - 1 ? 'text-gray-500 cursor-default' : 'hover:text-primary'"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : null"
        >
          {{ crumb.name }}
        </router-link>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'BreadcrumbNavigation',
  setup() {
    const route = useRoute();
    const breadcrumbs = ref([]);
    const hideBreadcrumbs = ref(false);

    const updateBreadcrumbs = () => {
      const pathArray = route.path.split('/').filter(i => i);
      hideBreadcrumbs.value = pathArray[1] === 'chat';
      breadcrumbs.value = pathArray
        .map((path, index) => {
          const to = '/' + pathArray.slice(0, index + 1).join('/');
          return {
            name: path.charAt(0).toUpperCase() + path.slice(1),
            path: to
          };
        })
        .filter(crumb => !['item', 'view', 'edit'].includes(crumb.name.toLowerCase()));
    };

    watch(() => route.path, updateBreadcrumbs, { immediate: true });

    return {
      breadcrumbs,
      hideBreadcrumbs
    };
  }
}
</script>

<style scoped>
.breadcrumb-container {
  display: flex;
  padding: 1rem 1rem;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.home-icon {
  margin-right: 8px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #6b7280; /* Tailwind's gray-500 */
}

.breadcrumb-item.active .breadcrumb-link {
  color: #6b7280; /* Tailwind's gray-500 */
  cursor: default;
  pointer-events: none;
}
</style>
