<template>
    <div class="check-field">
      <a-typography-text>
        <template v-if="value === true">
          <check-circle-filled :style="{ color: '#52c41a', fontSize: '16px' }" />
          <span class="ml-2">Yes</span>
        </template>
        <template v-else-if="value === false">
          <close-circle-filled :style="{ color: '#f5222d', fontSize: '16px' }" />
          <span class="ml-2">No</span>
        </template>
        <template v-else>
          <minus-circle-filled :style="{ color: '#faad14', fontSize: '16px' }" />
          <span class="ml-2">Not specified</span>
        </template>
      </a-typography-text>
    </div>
  </template>
  
  <script>
  import { Typography } from 'ant-design-vue';
  import { CheckCircleFilled, CloseCircleFilled, MinusCircleFilled } from '@ant-design/icons-vue';
  
  export default {
    name: 'CheckField',
    components: {
      ATypographyText: Typography.Text,
      CheckCircleFilled,
      CloseCircleFilled,
      MinusCircleFilled,
    },
    props: {
      field: {
        type: Object,
        required: true,
      },
      value: {
        type: Boolean,
        required: false,
      },
    },
  };
  </script>
  
  <style scoped>
  .check-field {
    width: 100%;
  }
  .ml-2 {
    margin-left: 8px;
  }
  </style>