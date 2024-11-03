<template>
  <div class="container mx-auto px-4 py-8">
    <template v-if="error">
      <a-alert type="error" message="Error" :description="error" show-icon />
    </template>

    <template v-else-if="loading">
      <div class="flex justify-center items-center min-h-[400px]">
        <a-spin size="large" />
      </div>
    </template>

    <template v-else-if="product">

      <!-- Breadcrumb -->
      <a-breadcrumb class="mb-6 mt-12">
        <a-breadcrumb-item>
          <router-link to="/home">Home</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/home/products">Products</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ product.productName }}</a-breadcrumb-item>
      </a-breadcrumb>

      <!-- Product Details Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 card">
        <!-- Product Images Section -->
        <div class="flex gap-4">
          <!-- Thumbnail Gallery -->
          <div class="flex flex-col gap-4 w-24">
            <div v-for="(image, index) in product.images" :key="index"
              class="aspect-square cursor-pointer rounded-md overflow-hidden"
              :class="{ 'ring-2 ring-primary': currentImage === image }" @click="currentImage = image">
              <img :src="image" :alt="`${product.productName} - ${index + 1}`" class="object-cover w-full h-full" />
            </div>
          </div>

          <!-- Main Image with Zoom -->
          <div class="flex-1">
            <div class="relative aspect-square overflow-hidden rounded-lg bg-gray-100" @mousemove="handleZoom"
              @mouseleave="isZoomed = false" ref="imageContainer">
              <img :src="currentImage" :alt="product.productName"
                class="object-cover w-full h-full transition-transform duration-200" :class="{ 'scale-150': isZoomed }"
                :style="zoomStyle" ref="mainImage" />
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ product.productName }}</h1>
            <a-tag>{{ product.category.categoryName }}</a-tag>
          </div>
          <div class="text-2xl font-extrabold text-primary">
            MWK{{ product.price }}
          </div>
          <div class="prose max-w-none" v-html="product.description"></div>

          <!-- Add to Cart Section -->
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <a-input-number v-model:value="quantity" :min="1" :max="99" class="w-24" />
              <a-button :style="{ backgroundColor: 'var(--primary)', color: '#ffff', borderColor: 'var(--primary)' }"
                size="large" :loading="addingToCart" @click="handleAddToCart">
                <template #icon>
                  <shopping-cart-outlined />
                </template>
                Add to Cart
              </a-button>
              <a-button type="default" size="large" @click="toggleWishlist" :class="{ 'text-primary': isWishlisted }">
                <template #icon>
                  <heart-outlined v-if="!isWishlisted" />
                  <heart-filled v-else />
                </template>
              </a-button>
            </div>

            <!-- Payment Buttons -->
            <button @click="handlePayment('paypal')"
                class="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                :disabled="isProcessingPayment">
                <i class="pi pi-paypal mr-2"></i>
                Pay with Airtel Money
              </button>
              <button @click="handlePayment('paypal')"
                class="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                :disabled="isProcessingPayment">
                <i class="pi pi-paypal mr-2"></i>
                Pay with Tnm Mpamba
              </button>
            <div class="flex space-x-4 mt-4">
              <button @click="handlePayment('stripe')"
                class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                :disabled="isProcessingPayment">
                Pay with Stripe
              </button>
              <button @click="handlePayment('paypal')"
                class="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                :disabled="isProcessingPayment">
                <i class="pi pi-paypal mr-2"></i>
                Pay with PayPal
              </button>
            </div>
          </div>

          <!-- Additional Info -->
          <a-collapse>
            <a-collapse-panel key="1" header="Shipping Information">
              <p>Free shipping on orders over $50</p>
              <p>Estimated delivery: 3-5 business days</p>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="Return Policy">
              <p>30-day return policy</p>
              <p>Free returns on unused items</p>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>


      <!-- Similar Products Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Similar Products</h2>
        <DataGroup :resource="productResource" display-mode="grid" :Layout="productResource.layout"
          :show-pagination="false" :show-header="false" :max-display-items="4" :preset-id-filters="{
            category: product.category
          }" sort-field="createdAt" sort-order="desc" @fetch-success="handleSimilarProductsFetch"
          @fetch-error="handleFetchError" />
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import DataGroup from '@/components/Object/DataGroup.vue';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import { translationKeys } from "@/executables/translation";
import * as Yup from "yup";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `${import.meta.env.VITE_APP_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  components: {
    DataGroup,
    ShoppingCartOutlined,
    HeartOutlined,
    HeartFilled
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const imageContainer = ref(null);
    const mainImage = ref(null);
    const isZoomed = ref(false);
    const zoomStyle = ref({});
    const isProcessingPayment = ref(false);

    const product = ref(null);
    const currentImage = ref('');
    const quantity = ref(1);
    const addingToCart = ref(false);
    const isWishlisted = ref(false);
    const loading = ref(true);
    const error = ref(null);

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
        }
      ],
      layout: {
  rows: 5,
  columns: 9,
  fields: {
    // Main image section
    images: {
      rowStart: 1,
      rowSpan: 5,
      colStart: 1,
      colSpan: 4
    },
    // Product info sections
    productName: {
      rowStart: 2,
      rowSpan: 1,
      colStart: 5,
      colSpan: 5
    },
    price: {
      rowStart: 3,
      rowSpan: 1,
      colStart: 5,
      colSpan: 3
    },
    category: {
      rowStart: 3,
      rowSpan: 1,
      colStart: 8,
      colSpan: 2
    },
    mainActions: {
      rowStart: 4,
      rowSpan: 1,
      colStart: 5,
      colSpan: 5
    }
  },
  actions: [
    {
      // Secondary actions dropdown
      name: 'product_secondary_actions',
      rowStart: 1,
      rowSpan: 1,
      colStart: 9,
      colSpan: 1,
      alignment: 'top-start',
      actions: [
        { name: 'bookmark', icon: 'fa fa-bookmark', label: 'Bookmark' },
        { name: 'dontRecommendProduct', icon: 'pi pi-times-circle', label: 'Don\'t Recommend' },
        { name: 'report', icon: 'fa fa-flag', label: 'Report' }
      ],
      orientation: 'dropdown',
      style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
    },
    {
      // Main action buttons
      name: 'product_main_actions',
      rowStart: 4,
      rowSpan: 1,
      colStart: 5,
      colSpan: 5,
      alignment: 'bottom-right',
      actions: [
        { name: 'addToCart', icon: 'fa fa-shopping-cart', label: 'Add' }
      ],
      orientation: 'buttons'
    }
  ]
}
    });


    const handleZoom = (event) => {
      if (!imageContainer.value || !mainImage.value) return;

      const { left, top, width, height } = imageContainer.value.getBoundingClientRect();
      const x = (event.clientX - left) / width;
      const y = (event.clientY - top) / height;

      isZoomed.value = true;
      zoomStyle.value = {
        transformOrigin: `${x * 100}% ${y * 100}%`
      };
    };

    const handlePayment = async (method) => {
  isProcessingPayment.value = true;
  try {
    if (method === 'stripe') {
      const { data } = await createStripeCheckoutSession(product.value.price * quantity.value);
      window.location.href = data.checkout_url;
    } else if (method === 'paypal') {
      // Convert MWK to USD (you may want to add proper conversion logic)
      const usdAmount = (product.value.price * quantity.value) / 1000; // Example conversion
      const { data } = await createPayPalOrder(usdAmount);
      
      // Make sure we're using the correct property from the response
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('PayPal checkout URL not received');
      }
    }
  } catch (err) {
    notification.error({
      message: 'Payment Error',
      description: err.response?.data?.message || 'Failed to process payment'
    });
    console.error('Payment error:', err);
  } finally {
    isProcessingPayment.value = false;
  }
};

    const createStripeCheckoutSession = async (premium) => {
      return await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/pay`, {
        paymentMethod: 'stripe',
        items: [{
          price_data: {
            currency: 'mwk',
            product_data: {
              name: product.value.productName,
              images: product.value.images,
            },
            unit_amount: premium * 100, // Convert to cents
          },
          quantity: quantity.value,
        }],
        metadata: {
          customerName: localStorage.getItem('userName'),
          customerEmail: localStorage.getItem('userEmail'),
          customerId: localStorage.getItem('userId'),
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment-cancel`,
        }
      });
    };

    const createPayPalOrder = async (usdAmount) => {
  return await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/pay`, {
    paymentMethod: 'paypal',
    amount: usdAmount,
    currency: 'USD',
    description: `Purchase of ${product.value.productName} x${quantity.value}`,
    metadata: {
      customerName: localStorage.getItem('userName'),
      customerEmail: localStorage.getItem('userEmail'),
      customerId: localStorage.getItem('userId'),
      successUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/payment-cancel`,
    }
  });
};


    const similarProductFilters = computed(() => {
      if (!product.value) return {};
      return {
        category: product.value.category.id,
        _id: { $ne: product.value._id }
      };
    });

    const fetchProduct = async () => {
      loading.value = true;
      error.value = null;

      try {
        const { data } = await api.get(`/products/${route.params.id}`);
        product.value = data;
        currentImage.value = data.images[0];
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load product details';
        notification.error({
          message: 'Error',
          description: error.value
        });
      } finally {
        loading.value = false;
      }
    };

    const handleAddToCart = async () => {
      addingToCart.value = true;
      try {
        await api.post('/cart/add', {
          productId: product.value._id,
          quantity: quantity.value
        });

        notification.success({
          message: 'Success',
          description: 'Product added to cart'
        });
      } catch (err) {
        notification.error({
          message: 'Error',
          description: err.response?.data?.message || 'Failed to add product to cart'
        });
      } finally {
        addingToCart.value = false;
      }
    };

    const toggleWishlist = async () => {
      try {
        const endpoint = isWishlisted.value ? '/wishlist/remove' : '/wishlist/add';
        await api.post(endpoint, {
          productId: product.value._id
        });

        isWishlisted.value = !isWishlisted.value;
        notification.success({
          message: isWishlisted.value ? 'Added to Wishlist' : 'Removed from Wishlist',
          description: isWishlisted.value
            ? 'Product has been added to your wishlist'
            : 'Product has been removed from your wishlist'
        });
      } catch (err) {
        notification.error({
          message: 'Error',
          description: err.response?.data?.message || 'Failed to update wishlist'
        });
      }
    };

    const checkWishlistStatus = async () => {
      try {
        const { data } = await api.get(`/wishlist/check/${route.params.id}`);
        isWishlisted.value = data.isWishlisted;
      } catch (err) {
        console.error('Failed to check wishlist status:', err);
      }
    };

    onMounted(() => {
      fetchProduct();
      checkWishlistStatus();
    });

    return {
      product,
      currentImage,
      quantity,
      addingToCart,
      isWishlisted,
      loading,
      error,
      productResource,
      similarProductFilters,
      handleAddToCart,
      toggleWishlist,
      imageContainer,
      mainImage,
      isZoomed,
      zoomStyle,
      handleZoom,
      handlePayment,
      createStripeCheckoutSession,
      createPayPalOrder,
      isProcessingPayment
    };
  },

  methods: {
    handleSimilarProductsFetch(products) {
      console.log('Similar products loaded:', products);
    },
    handleFetchError(error) {
      console.error('Fetch error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load similar products'
      });
    }
  }
};
</script>

<style scoped>
.text-primary {
  color: #1890ff;
}

.ring-primary {
  --tw-ring-color: #1890ff;
}

:deep(.ant-collapse) {
  background: transparent;
}

:deep(.ant-input-number) {
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-top: 1rem;
  }
}
</style>