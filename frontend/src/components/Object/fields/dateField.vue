<template>
    <div class="date-field">
      <a-typography-text>
        {{ formattedDate }}
      </a-typography-text>
    </div>
  </template>
  
  <script>
  import { Typography } from 'ant-design-vue';
  import { computed } from 'vue';
  
  export default {
    name: 'DateField',
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
    setup(props) {
      const formattedDate = computed(() => {
        if (!props.value) return '';
        
        const date = new Date(props.value);
        if (isNaN(date.getTime())) return 'Invalid Date';
  
        // You can customize the date format as needed
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      });
  
      return {
        formattedDate,
      };
    },
  };
  </script>
  
  <style scoped>
  .date-field {
    width: 100%;
  }
  </style>