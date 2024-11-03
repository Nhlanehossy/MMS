<template>
    <div class="phone-number-field">
    
        <a :href="`tel:${value}`">{{ formattedPhoneNumber }}</a>

    </div>
  </template>
  
  <script>
  import { Typography } from 'ant-design-vue';
  import { computed } from 'vue';
  
  export default {
    name: 'PhoneNumberField',
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
      const formattedPhoneNumber = computed(() => {
        // You can implement phone number formatting logic here if needed
        // For now, we'll just return the value as is
        return props.value;
      });
  
      return {
        formattedPhoneNumber,
      };
    },
  };
  </script>
  
  <style scoped>
  .phone-number-field {
    width: 100%;
    font-size: 0.2rem;
  }
  </style>