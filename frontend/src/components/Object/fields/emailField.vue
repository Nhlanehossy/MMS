<template>
  <div class="email-field">
    <a :href="`mailto:${value}`">{{ value }}</a>
  </div>
</template>

<script>
import { Typography } from 'ant-design-vue';

export default {
  name: 'EmailField',
  components: {
    ATypographyText: Typography.Text,
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
  },
};
</script>

<style scoped>
.email-field {
  font-size: 0.2rem;
  color: var(--primary) !important;
}
</style>