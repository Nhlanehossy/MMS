<template>
  <div class="font-icon-field-display text-text">
    <i :class="value" style="font-size: 24px;"></i>
  </div>
</template>

<script>
export default {
  name: 'FontIconField',
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
