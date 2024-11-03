<template>
  <a-card hoverable class="product-card">
    <template #cover>
      <img alt="product" :src="product.images[0]" />
    </template>
    <a-card-meta :title="product.productName">
      <template #description>
        <div>
          <p>{{ product.description.substring(0, 100) }}...</p>
          <p class="price">${{ product.price.toFixed(2) }}</p>
          <a-rate :value="averageRating" disabled allow-half />
          <span class="ant-rate-text">{{ averageRating }}</span>
        </div>
      </template>
    </a-card-meta>
    <template #actions>
      <a-tag v-for="tagId in product.tags" :key="tagId" color="blue">
        {{ getTagName(tagId) }}
      </a-tag>
    </template>
    <a-button type="primary" block @click="addToCart">Add to Cart</a-button>
  </a-card>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const averageRating = computed(() => {
      if (!props.product.reviews || props.product.reviews.length === 0) return 0;
      const sum = props.product.reviews.reduce((acc, review) => acc + review.rating, 0);
      return (sum / props.product.reviews.length).toFixed(1);
    });

    const getTagName = (tagId) => {
      const tag = props.tags.find(t => t._id === tagId);
      return tag ? tag.tagName : '';
    };

    const addToCart = () => {
      // Implement add to cart functionality
      message.success(`Added ${props.product.productName} to cart`);
    };

    return {
      averageRating,
      getTagName,
      addToCart,
    };
  },
});
</script>

<style scoped>
.product-card {
  height: 100%;
}

.price {
  font-weight: bold;
  color: #f5222d;
}
</style>
