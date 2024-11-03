<template>
  <div class="container mt-36 mx-auto px-4">
    <!-- Header with Filter Trigger -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-lg font-medium" v-if="hasActiveFilters">
          Showing Results For: {{ activeFiltersText }}
          <div class="text-sm text-gray-500 mt-1">
            {{ resultCount }} items found
          </div>
        </h3>
        <h3 class="text-lg font-medium" v-else>
          All Products
          <div class="text-sm text-gray-500 mt-1">
            {{ resultCount }} items found
          </div>
        </h3>
      </div>

      <a-dropdown :trigger="['click']" @visibleChange="handleDropdownVisibility">
        <a-button type="text">
          <template #icon>
            <FunnelPlotOutlined :style="{ fontSize: '20px', color: hasActiveFilters ? '#1890ff' : '#555' }" />
          </template>
        </a-button>
        <template #overlay>
          <div class="filter-dropdown-menu p-4 bg-white rounded-lg shadow-lg" style="width: 300px">
            <!-- Search Input -->
            <div class="mb-6">
              <h4 class="font-medium mb-2">Search</h4>
              <a-input v-model:value="searchQuery" placeholder="Search products..." @change="handleSearchChange"
                allowClear />
            </div>

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

            <div class="flex gap-2">
              <a-button block @click="applyFilters" type="primary">
                Apply Filters
              </a-button>
              <a-button block @click="clearFilters" type="default">
                Clear
              </a-button>
            </div>
          </div>
        </template>
      </a-dropdown>
    </div>

    <!-- Products Grid -->
    <div ref="infiniteScrollContainer" class="overflow-auto" @scroll="handleScroll"
     >
      <DataGroup :resource="productResource" display-mode="list" :Layout="productResource.layout"
        :show-pagination="false" :show-header="false" :show-more-link="false" :max-display-items="displayedItems"
        :preset-filters="filters" :default-page-size="displayedItems" :search-query="searchQuery" sort-field="createdAt"
        sort-order="desc" @fetch-success="handleFetchSuccess" @fetch-error="handleFetchError"  />

      <div v-if="isLoading" class="flex justify-center py-4">
        <a-spin />
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DataGroup from '@/components/Object/DataGroup.vue';
import { FilterOutlined, FunnelPlotOutlined } from '@ant-design/icons-vue';
import { e_commerce_management_system } from '@/modules/e_commerce_system/system';
import { translationKeys } from "@/executables/translation";
import { debounce } from 'lodash';
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

    // State Management
    const categories = ref([]);
    const selectedCategories = ref([]);
    const searchQuery = ref('');
    const priceRange = ref({ value: [0, 1000] });
    const filters = ref({});
    const resultCount = ref(0);
    const displayedItems = ref(10);
    const isLoading = ref(false);
    const hasMore = ref(true);
    const infiniteScrollContainer = ref(null);
    const dropdownVisible = ref(false);

    // Computed Properties
    const hasActiveFilters = computed(() => {
      return searchQuery.value ||
        selectedCategories.value.length > 0 ||
        priceRange.value.value[0] > 0 ||
        priceRange.value.value[1] < 1000;
    });

    const activeFiltersText = computed(() => {
      const parts = [];
      if (searchQuery.value) parts.push(`"${searchQuery.value}"`);
      if (selectedCategories.value.length) {
        const categoryNames = selectedCategories.value
          .map(id => categories.value.find(c => c.id === id)?.categoryName)
          .filter(Boolean);
        if (categoryNames.length) parts.push(categoryNames.join(', '));
      }
      if (priceRange.value.value[0] > 0 || priceRange.value.value[1] < 1000) {
        parts.push(`$${priceRange.value.value[0]} - $${priceRange.value.value[1]}`);
      }
      return parts.join(' in ');
    });

    // Product Resource Definition
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

    // Methods
    const handleDropdownVisibility = (visible) => {
      dropdownVisible.value = visible;
    };

    const handleScroll = debounce(async (event) => {
      const element = event.target;
      if (
        !isLoading.value &&
        hasMore.value &&
        element.scrollHeight - element.scrollTop <= element.clientHeight + 100
      ) {
        isLoading.value = true;
        displayedItems.value += 10;
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
        isLoading.value = false;
      }
    }, 200);

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
        ...(priceRange.value.value[0] > 0 || priceRange.value.value[1] < 1000 && {
          price: {
            $gte: priceRange.value.value[0],
            $lte: priceRange.value.value[1]
          }
        })
      };

      // Reset infinite scroll
      displayedItems.value = 10;
      hasMore.value = true;
      dropdownVisible.value = false;
    };

    const clearFilters = () => {
      selectedCategories.value = [];
      priceRange.value.value = [0, 1000];
      searchQuery.value = '';
      router.push({ query: {} });
      filters.value = {};
      displayedItems.value = 10;
      hasMore.value = true;
      dropdownVisible.value = false;
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

    const handleFetchSuccess = (response) => {
      resultCount.value = response.total || 0;
      hasMore.value = displayedItems.value < resultCount.value;
      console.log('Total items:', resultCount.value, 'Displayed items:', displayedItems.value, 'Has more:', hasMore.value); // Add this
    };

    const handleFetchError = (error) => {
      console.error('Fetch error:', error);
    };

    // Watchers
    watch(categories, (newCategories) => {
      if (newCategories.length > 0) {
        initializeFiltersFromQuery();
        applyFilters();
      }
    }, { immediate: true });

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

    // Lifecycle Hooks
    onMounted(async () => {
      await fetchCategories();
      initializeFiltersFromQuery();
      applyFilters();
    });

    return {
      // State
      categories,
      selectedCategories,
      searchQuery,
      priceRange,
      filters,
      productResource,
      resultCount,
      displayedItems,
      isLoading,
      hasMore,
      infiniteScrollContainer,
      dropdownVisible,

      // Computed
      hasActiveFilters,
      activeFiltersText,

      // Methods
      handleDropdownVisibility,
      handleScroll,
      handleSearchChange,
      applyFilters,
      clearFilters,
      handleFetchSuccess,
      handleFetchError
    };
  }
};
</script>