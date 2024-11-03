<template>
  <div class="image-field-display">
    <img
      v-if="isAvatar"
      :src="value"
      :alt="field.title"
      :preview="{ src: value }"
      class="avatar-container"
    />
    <img
      v-else
      :src="value"
      :alt="field.title"
      :preview="{ src: value }"
      class="fill-container"
    />
  </div>
</template>

<script>
import { Image } from 'ant-design-vue';

export default {
  name: 'ImageField',
  components: {
    AImage: Image,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    isAvatar: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.image-field-display {
  width: 100%;
  height: 100%;
}

.fill-container {
  width: 100%;
  height: 100%;
  object-fit: fill;
}


</style>
