<template>
    <div>
      <!-- Search Icon Trigger -->
      <span type="text" @click="showSearchOverlay = true" class="search-trigger">
        <a-input-search placeholder="search"></a-input-search>
      </span>
  
      <!-- Search Overlay -->
      <a-modal v-model:visible="showSearchOverlay" :footer="null" width="1000px" centered class="search-overlay"
        :destroyOnClose="true">
        <div class="search-container">
          <!-- Search Input -->
          <a-input-search ref="searchInputRef" v-model:value="searchQuery" size="large"
            placeholder="Search across all resources..." :style="{ width: '100%' }" @search="handleSearch" allowClear>
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
  
          <div class="search-content mt-6">
            <!-- Search Results Header -->
            <div v-if="searchQuery" class="search-header">
              <div class="search-info">
                <h3>Results for "{{ searchQuery }}"</h3>
                <span class="results-count">{{ totalResults }} results found</span>
              </div>
            </div>
  
            <a-row>
              <!-- Main Content -->
              <a-col :span="24">
                <!-- Resources Grid -->
                <div v-if="!searchQuery" class="p-4">
                  <h3 class="text-lg font-semibold mb-4">Available Resources</h3>
  
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div v-for="resource in resources" :key="resource.name"
                      class="cursor-pointer transition-transform hover:scale-105 flex card"
                      @click="handleResourceClick(resource)">
                      <div class="flex flex-col flex-1 items-center p-4">
                        <i :class="resource.icon" class="text-3xl mb-2"></i>
                        <span class="text-sm sm:text-base text-center font-medium text-text line-clamp-2 mt-auto">
                          {{ resource.label }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Search Results list -->
                <div v-else-if="filteredResults.length > 0" class="w-full">
                  <a-list v-infinite-scroll="loadMore" item-layout="horizontal" :data-source="displayedResults"
                    :loading="loading">
                    <template #renderItem="{ item }">
                      <a-list-item @click="handleItemClick(item)" class="search-result-item" style="width: 100%">
                        <span class="card w-full p-4">
                          <ResourceRenderer
                            :resource="getResourceByName(item.resourceType)"
                            :displayData="item"
                            :layout="getResourceByName(item.resourceType).layout"
                            :showHeading="false"
                            :showActions="false"
                          />
                        </span>
                      </a-list-item>
                    </template>
                  </a-list>
  
                  <!-- Infinite Scroll Observer -->
                  <div ref="infiniteScrollTrigger" class="scroll-trigger"></div>
                </div>
  
                <!-- No Results -->
                <div v-else-if="searchQuery" class="no-results">
                  <a-empty description="No results found" />
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-modal>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, computed, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { getFilteredResources } from '@/executables/accessControl';
  import ResourceRenderer from '../Object/objectrenderer.vue';
  
  
  // State
  const searchQuery = ref('');
  const showSearchOverlay = ref(false);
  const resources = ref([]);
  const searchResults = ref([]);
  const page = ref(1);
  const loading = ref(false);
  const hasMore = ref(true);
  const infiniteScrollTrigger = ref(null);
  const searchInputRef = ref(null);
  const ITEMS_PER_PAGE = 9;
  const MAX_RESULTS = 500;
  
  // Computed
  const totalResults = computed(() => filteredResults.value.length);
  
  const filteredResults = computed(() => searchResults.value);
  
  const displayedResults = computed(() => {
    const startIndex = 0;
    const endIndex = page.value * ITEMS_PER_PAGE;
    return filteredResults.value.slice(startIndex, endIndex);
  });
  
  // API calls
  const fetchResources = async () => {
    try {
      const roleId = localStorage.getItem("role");
      const allResources = await getFilteredResources(roleId);
      resources.value = allResources.filter(resource => resource.name !== 'permissions');
    } catch (error) {
      console.error('Error fetching resources:', error);
      message.error('Failed to load resources');
    }
  };
  
  const searchAcrossResources = async () => {
    if (!searchQuery.value.trim()) return;
    
    loading.value = true;
    searchResults.value = [];
    
    try {
      const searchPromises = resources.value.map(async (resource) => {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resource.path}?search=${searchQuery.value}&limit=${MAX_RESULTS}`);
        const data = await response.json();
        return data.data.map(item => ({
          ...item,
          resourceType: resource.name
        }));
      });
  
      const results = await Promise.all(searchPromises);
      searchResults.value = results.flat();
    } catch (error) {
      console.error('Error searching resources:', error);
      message.error('Failed to search');
    } finally {
      loading.value = false;
    }
  };
  
  // Helpers
  const getResourceByName = (name) => {
    return resources.value.find(resource => resource.name === name);
  };
  
  // Event handlers
  const handleSearch = () => {
    if (!searchQuery.value.trim()) {
      message.warning('Please enter a search term');
      return;
    }
    searchAcrossResources();
  };
  
  const handleItemClick = (item) => {
    showSearchOverlay.value = false;
    window.location.href = `/dashboard/${item.resourceType}/${item.id}/view`;
  };
  
  const handleResourceClick = (resource) => {
    showSearchOverlay.value = false;
    window.location.href = `/dashboard/${resource.path}`;
  };
  
  // Infinite scroll setup
  const setupInfiniteScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading.value && hasMore.value) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
  
    if (infiniteScrollTrigger.value) {
      observer.observe(infiniteScrollTrigger.value);
    }
  };
  
  const loadMore = () => {
    if (loading.value || !hasMore.value) return;
  
    loading.value = true;
    setTimeout(() => {
      page.value++;
      hasMore.value = displayedResults.value.length < filteredResults.value.length;
      loading.value = false;
    }, 500);
  };
  
  // Watchers
  watch(searchQuery, () => {
    page.value = 1;
    hasMore.value = true;
    if (searchQuery.value) {
      searchAcrossResources();
    }
  });
  
  watch(showSearchOverlay, async (newValue) => {
    if (newValue) {
      await nextTick();
      searchInputRef.value?.input?.focus();
    }
  });
  
  // Lifecycle
  onMounted(() => {
    fetchResources();
    setupInfiniteScroll();
  });
  </script>
  
  <style scoped>
  /* Keep the existing styles from your original component */
  .search-trigger {
    font-size: 20px;
  }
  
  .search-overlay :deep(.ant-modal-content) {
    border-radius: 16px;
    padding: 24px;
  }
  
  .search-container {
    padding: 12px;
  }
  
  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .search-info h3 {
    margin: 0;
    font-size: 18px;
  }
  
  .results-count {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  
  .search-result-item {
    margin-bottom: 16px;
    cursor: pointer;
  }
  
  .scroll-trigger {
    height: 20px;
    margin-top: 16px;
  }
  
  .no-results {
    padding: 48px 0;
    text-align: center;
  }
  
  :deep(.ant-input-search-button) {
    background-color: var(--primary);
    border-color: var(--primary);
  }
  
  :deep(.ant-input-search-button:hover) {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
  }
  </style>