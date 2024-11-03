<!-- components/SearchBar.vue -->
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
          placeholder="Search for products..." :style="{ width: '100%' }" @search="handleSearch" allowClear>
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

            <!-- Filter Dropdown -->
            <a-dropdown>
              <a-button>
                <template #icon>
                  <FilterOutlined />
                </template>
                Filters
              </a-button>
              <template #overlay>
                <a-menu>
                  <div class="price-filter-menu">
                    <h4>Price Range</h4>
                    <a-slider v-model:value="priceRange" range :min="0" :max="1000000" :step="1000"
                      @change="handlePriceRangeChange" />
                    <div class="price-labels">
                      <span>{{ formatPrice(priceRange[0]) }}</span>
                      <span>{{ formatPrice(priceRange[1]) }}</span>
                    </div>
                  </div>
                </a-menu>
              </template>
            </a-dropdown>
          </div>

          <a-row>


            <!-- Main Content -->
            <a-col :span="24">
              <!-- Categories Grid -->
              <div v-if="!searchQuery" class="p-4">
                <h3 class="text-lg font-semibold mb-4">Popular Categories</h3>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div v-for="category in categories" :key="category.id"
                    class="cursor-pointer transition-transform hover:scale-105 flex card"
                    @click="handleCategoryClick(category)">

                    <div class="flex flex-col flex-1 items-center">
                      <div class="w-full aspect-square mb-2">
                        <img :src="category.image" :alt="category.categoryName"
                          class="w-full h-full object-cover rounded-md" />
                      </div>
                      <span class="text-sm sm:text-base text-center font-medium text-text line-clamp-2 mt-auto">
                        {{ category.categoryName }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              <!-- Search Results list covering the full width -->
              <div v-else-if="filteredProducts.length > 0" class="w-full">
                <a-list v-infinite-scroll="loadMore" item-layout="horizontal" :data-source="displayedProducts"
                  :loading="loading">
                  <template #renderItem="{ item }">
                    <a-list-item @click="handleProductClick(item)" class="product-item" style="width: 100%">
                      <span class="card w-full">
                        <div style="display: flex; gap: 16px; align-items: center">
                          <img :src="item.images[0]" :alt="item.productName" class="product-image"
                            style="width: 120px; height: 120px; object-fit: cover" />
                          <div class="product-details">
                            <h4>{{ item.productName }}</h4>
                            <p class="price">{{ formatPrice(item.price) }}</p>
                          </div>
                        </div>
                      </span>
                    </a-list-item>
                  </template>
                </a-list>

                <!-- Infinite Scroll Observer -->
                <div ref="infiniteScrollTrigger" class="scroll-trigger"></div>
              </div>

              <!-- No Results -->
              <div v-else-if="searchQuery" class="no-results">
                <a-empty description="No products found" />
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
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons-vue';

const router = useRouter();

// State
const searchQuery = ref('');
const showSearchOverlay = ref(false);
const categories = ref([]);
const products = ref([]);
const filteredProducts = ref([]);
const priceRange = ref([0, 1000000]);
const selectedCategory = ref(null);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const infiniteScrollTrigger = ref(null);
const searchInputRef = ref(null);
const ITEMS_PER_PAGE = 9;
const MAX_RESULTS = 500;

// Computed
const totalResults = computed(() => filteredProducts.value.length);

const displayedProducts = computed(() => {
  const startIndex = 0;
  const endIndex = page.value * ITEMS_PER_PAGE;
  return filteredProducts.value.slice(startIndex, endIndex);
});

// API calls
const fetchCategories = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/categories?limit=1000`);
    const data = await response.json();
    categories.value = data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    message.error('Failed to load categories');
  }
};

const fetchProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/products?limit=1000`);
    const data = await response.json();
    products.value = data.data.slice(0, MAX_RESULTS);
    applyFilters();
  } catch (error) {
    console.error('Error fetching products:', error);
    message.error('Failed to load products');
  }
};

// Filter handlers
const applyFilters = () => {
  filteredProducts.value = products.value.filter(product => {
    const matchesSearch = !searchQuery.value.trim() ||
      product.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory = !selectedCategory.value ||
      product.categoryId === selectedCategory.value;

    const matchesPrice = product.price >= priceRange.value[0] &&
      product.price <= priceRange.value[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });
};

const handlePriceRangeChange = () => {
  applyFilters();
};

const handleCategoryFilter = (category) => {
  selectedCategory.value = category.id;
  applyFilters();
};

// Infinite scroll
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
    hasMore.value = displayedProducts.value.length < filteredProducts.value.length;
    loading.value = false;
  }, 500);
};

// Helpers
const getCategoryCount = (categoryId) => {
  return filteredProducts.value.filter(product => product.categoryId === categoryId).length;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MWK'
  }).format(price);
};

// Event handlers
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    message.warning('Please enter a search term');
    return;
  }

  showSearchOverlay.value = false;
 // router.push(`/home/products?search=${searchQuery.value}`);
 window.location.href = `/home/products?search=${searchQuery.value}`
};

const handleProductClick = (product) => {
  showSearchOverlay.value = false;
  window.location.href = `/home/product/${product.id}`
};

const handleCategoryClick = (category) => {
  showSearchOverlay.value = false;
  window.location.href = `/home/products?categories=${category.id}`
};

// Watchers
watch(searchQuery, () => {
  page.value = 1;
  hasMore.value = true;
  applyFilters();
});

// Watch for changes to showSearchOverlay
watch(showSearchOverlay, async (newValue) => {
  if (newValue) {
    // Wait for the modal to be fully rendered
    await nextTick();
    // Focus the input
    searchInputRef.value?.input?.focus();
  }
});

// Lifecycle
onMounted(() => {
  fetchCategories();
  fetchProducts();
  setupInfiniteScroll();
});
</script>



<style scoped>
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

.categories-sidebar {
  padding-right: 24px;
  border-right: 1px solid #f0f0f0;
}

.sidebar-title {
  margin-bottom: 16px;
  font-weight: 500;
}

.category-count {
  float: right;
  color: rgba(0, 0, 0, 0.45);
}

.price-filter-menu {
  padding: 16px;
  min-width: 250px;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.product-item {
  margin-bottom: 16px;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-details {
  padding: 12px;
}

.product-details h4 {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.price {
  margin: 8px 0 0;
  color: var(--primary);
  font-weight: 500;
}

.scroll-trigger {
  height: 20px;
  margin-top: 16px;
}

.category-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.category-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
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