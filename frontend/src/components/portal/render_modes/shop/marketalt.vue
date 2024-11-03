<template>
    <div class="container mt-36 mx-auto px-4">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Ant Design Filter Sidebar -->
        <span class="card">
          <a-layout-sider :style="{ background: 'var(--cardLight)!important' }" breakpoint="lg" :width="180">
            <div class="p-4">
              <!-- Search Input -->
              <div class="mb-6">
                <h4 class="font-medium mb-2">Search</h4>
                <a-input v-model:value="searchQuery" placeholder="Search products..." @change="handleSearchChange"
                  allowClear />
              </div>
  
              <h3 class="text-lg font-semibold mb-4">Filters</h3>
  
              <!-- Categories -->
              <div class="mb-6">
                <h4 class="font-medium mb-2">Categories</h4>
                <div class="space-y-2">
                  <a-checkbox-group v-model:value="selectedCategories" @change="applyFilters">
                    <div v-for="category in categories" :key="category.id" class="flex items-center mb-2">
                      <a-checkbox :value="category.id">
                        {{ category.categoryName }}
                      </a-checkbox>
                    </div>
                  </a-checkbox-group>
                </div>
              </div>
  
              <!-- Price Range Slider -->
              <div class="mb-6">
                <h4 class="font-medium mb-2">Price Range</h4>
                <div class="space-y-3">
                  <a-slider v-model:value="priceRange.value" range :min="0" :max="1000" @afterChange="applyFilters" />
                  <div class="flex justify-between text-sm">
                    <span>${{ priceRange.value[0] }}</span>
                    <span>${{ priceRange.value[1] }}</span>
                  </div>
                </div>
              </div>
  
              <a-button block @click="clearFilters" type="default">
                Clear Filters
              </a-button>
            </div>
          </a-layout-sider>
        </span>
  
        <!-- Main Content -->
        <div class="flex-1">
          <!-- Active Filters Display -->
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span v-if="activeFilterCount > 0" class="text-sm text-gray-600">
                Active Filters ({{ activeFilterCount }}):
              </span>
              <div class="flex flex-wrap gap-2">
                <!-- Search Query Tag -->
                <a-tag v-if="searchQuery" closable @close="clearSearchQuery">
                  Search: {{ searchQuery }}
                </a-tag>
  
                <a-tag v-for="category in selectedCategories" :key="category" closable @close="removeCategory(category)">
                  {{ getCategoryName(category) }}
                </a-tag>
                <a-tag v-if="isPriceFilterActive" closable @close="clearPriceFilter">
                  Price: MWK{{ priceRange.value[0] }} - MWK{{ priceRange.value[1] }}
                </a-tag>
              </div>
            </div>
            <a-button type="text" @click="isFilterCollapsed = !isFilterCollapsed">
              <template #icon>
                <FunnelPlotOutlined :style="{ fontSize: '20px', color: activeFilterCount > 0 ? '#1890ff' : '#555' }" />
              </template>
            </a-button>
          </div>
  
          <!-- Products Grid -->
          <DataGroup :resource="productResource" display-mode="grid" :Layout="productResource.layout"
            :show-pagination="true" :show-header="true" header-title="Products" :show-more-link="false"
            :max-display-items="12" :preset-filters="filters" :search-query="searchQuery" sort-field="createdAt"
            sort-order="desc" @fetch-success="handleFetchSuccess" @fetch-error="handleFetchError"
            @page-change="handlePageChange" />
        </div>
      </div>
  
      <!-- Mobile Filter Toggle -->
      <a-button @click="isFilterCollapsed = !isFilterCollapsed" class="md:hidden fixed bottom-4 right-4 z-50"
        type="primary" shape="circle">
        <template #icon>
          <FilterOutlined />
        </template>
      </a-button>
    </div>
  </template>
  
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import DataGroup from '@/components/Object/DataGroup.vue';
  import { FilterOutlined, FunnelPlotOutlined } from '@ant-design/icons-vue';
  import { e_commerce_management_system } from '@/modules/e_commerce_system/system';
  import { translationKeys } from "@/executables/translation";
  import * as Yup from "yup";
  
  export default {
    components: {
      DataGroup,
      FilterOutlined,
      FunnelPlotOutlined
    },
  
    setup() {
      const router = useRouter();
      const route = useRoute();
  
      const isFilterCollapsed = ref(false);
      const categories = ref([]);
      const selectedCategories = ref([]);
      const searchQuery = ref('');
      const priceRange = ref({
        value: [0, 1000]
      });
  
      const filters = ref({});
  
      const activeFilterCount = computed(() => {
        let count = 0;
        if (selectedCategories.value.length) count++;
        if (isPriceFilterActive.value) count++;
        if (searchQuery.value) count++;
        return count;
      });
  
      const isPriceFilterActive = computed(() => {
        return priceRange.value.value[0] > 0 || priceRange.value.value[1] < 1000;
      });
  
      const productResource = ref({
        name: "products",
        path: "products",
        icon: "pi pi-box",
        label: translationKeys.Products || "Products",
        resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
        schema: [
          {
            name: "images",
            title: translationKeys.Image || "Images",
            type: "image array",
            validation: Yup.array().of(Yup.string().nullable()),
          },
          {
            name: "productName",
            title: translationKeys.ProductName || "Product Name",
            type: "text",
            validation: Yup.string().required("Product Name is required."),
          },
          {
            name: "category",
            title: translationKeys.Category || "Category",
            type: "ref",
            resource: "categories",
            field: "categoryName",
            validation: Yup.string().required("Category is required."),
          },
          {
            name: "price",
            title: "price",
            type: "price",
            validation: Yup.string().required("Price is required."),
          },
          {
            name: "description",
            title: translationKeys.Description || "Description",
            type: "richtext",
            validation: Yup.string().required("Description is required."),
          },
        ],
        layout: {
          rows: 5,
          columns: 11,
          fields: {
            images: {
              rowStart: 1,
              rowSpan: 5,
              colStart: 1,
              colSpan: 4
            },
            productName: {
              rowStart: 2,
              rowSpan: 1,
              colStart: 5,
              colSpan: 7
            },
            price: {
              rowStart: 3,
              rowSpan: 1,
              colStart: 5,
              colSpan: 7
            },
            category: {
              rowStart: 4,
              rowSpan: 1,
              colStart: 5,
              colSpan: 7
            }
          },
          actions: [
            {
              name: 'product_secondary_actions',
              rowStart: 1,
              rowSpan: 1,
              colStart: 11,
              colSpan: 1,
              alignment: 'top-right',
              actions: [
                { name: 'bookmark', icon: 'fa fa-bookmark', label: 'Bookmark' },
                { name: 'dontRecommendProduct', icon: 'pi pi-times-circle', label: 'Don\'t Recommend' },
                { name: 'report', icon: 'fa fa-flag', label: 'Report' }
              ],
              orientation: 'dropdown',
              style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
            },
            {
              name: 'product_main_actions',
              rowStart: 5,
              rowSpan: 1,
              colStart: 5,
              colSpan: 7,
              alignment: 'bottom-right',
              actions: [
                { name: 'addToCart', icon: 'fa fa-shopping-cart', label: 'Add' }
              ],
              orientation: 'buttons'
            }
          ]
        }
      });
  
      const fetchCategories = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/categories`);
          const data = await response.json();
          categories.value = data.data;
          return data.data;
        } catch (error) {
          console.error('Error fetching categories:', error);
          return [];
        }
      };
  
      const handleSearchChange = () => {
        applyFilters();
      };
  
      const clearSearchQuery = () => {
        searchQuery.value = '';
        applyFilters();
      };
  
      const getCategoryName = (categoryId) => {
        const category = categories.value.find(c => c.id === categoryId);
        return category ? category.categoryName : categoryId;
      };
  
      const removeCategory = (categoryId) => {
        selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId);
        applyFilters();
      };
  
      const clearPriceFilter = () => {
        priceRange.value.value = [0, 1000];
        applyFilters();
      };
  
      const applyFilters = () => {
        const queryParams = {};
  
        if (searchQuery.value) {
          queryParams.search = searchQuery.value;
        }
  
        if (selectedCategories.value.length) {
          queryParams.categories = selectedCategories.value.join(',');
        }
  
        if (priceRange.value.value[0] > 0 || priceRange.value.value[1] < 1000) {
          queryParams.minPrice = priceRange.value.value[0];
          queryParams.maxPrice = priceRange.value.value[1];
        }
  
        router.push({ query: queryParams });
  
        filters.value = {
          ...(searchQuery.value && {
            $or: [
              { productName: { $regex: searchQuery.value, $options: 'i' } },
              { description: { $regex: searchQuery.value, $options: 'i' } }
            ]
          }),
          ...(selectedCategories.value.length && { category: { $in: selectedCategories.value } }),
          ...(isPriceFilterActive.value && {
            price: {
              $gte: priceRange.value.value[0],
              $lte: priceRange.value.value[1]
            }
          })
        };
      };
  
      const clearFilters = () => {
        selectedCategories.value = [];
        priceRange.value.value = [0, 1000];
        searchQuery.value = '';
        router.push({ query: {} });
        filters.value = {};
      };
  
      const initializeFiltersFromQuery = () => {
        if (route.query.search) {
          searchQuery.value = route.query.search;
        }
  
        if (route.query.categories && categories.value.length > 0) {
          const categoryIds = route.query.categories.split(',');
          selectedCategories.value = categoryIds.filter(id =>
            categories.value.some(c => c.id === id)
          );
        }
  
        if (route.query.minPrice && route.query.maxPrice) {
          priceRange.value.value = [
            parseInt(route.query.minPrice),
            parseInt(route.query.maxPrice)
          ];
        }
      };
  
      // Watch for categories loading
      watch(
        categories,
        (newCategories) => {
          if (newCategories.length > 0) {
            initializeFiltersFromQuery();
            applyFilters();
          }
        },
        { immediate: true }
      );
  
      // Watch for route query changes
      watch(() => route.query, (newQuery) => {
        if (!newQuery.search) {
          searchQuery.value = '';
        }
        if (!newQuery.categories) {
          selectedCategories.value = [];
        }
        if (!newQuery.minPrice || !newQuery.maxPrice) {
          priceRange.value.value = [0, 1000];
        }
      });
  
      onMounted(async () => {
        await fetchCategories();
        initializeFiltersFromQuery();
        applyFilters();
      });
  
      return {
        isFilterCollapsed,
        categories,
        selectedCategories,
        searchQuery,
        priceRange,
        filters,
        productResource,
        activeFilterCount,
        isPriceFilterActive,
        applyFilters,
        clearFilters,
        getCategoryName,
        removeCategory,
        clearPriceFilter,
        handleSearchChange,
        clearSearchQuery
      };
    },
  
    methods: {
      handleFetchSuccess() { },
      handleFetchError(error) {
        console.error('Fetch error:', error);
      },
      handlePageChange(page) {
        this.$router.push({
          query: {
            ...this.$route.query,
            page: page
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .site-layout-background {
    background: #fff !important;
    border-right: 1px solid #f0f0f0;
  }
  
  :deep(.ant-layout-sider) {
    background: #fff !important;
  }
  
  :deep(.ant-checkbox-wrapper) {
    margin-left: 0 !important;
  }
  
  :deep(.ant-slider) {
    margin: 10px 6px 24px;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .site-layout-background {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
  
    .site-layout-background.visible {
      transform: translateX(0);
    }
  }
  </style>