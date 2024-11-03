<template>
  <div class="confirmation-step">
    <h2>Please confirm your information</h2>
    <div v-for="field in schema" :key="field.name" class="confirmation-field">
      <strong>{{ field.title }}:</strong>
      <span>{{ formatValue(formData[field.name], field.type) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formData: Object,
    schema: Array,
  },
  methods: {
    formatValue(value, type) {
      switch (type) {
        case 'date':
          return new Date(value).toLocaleDateString();
        case 'checkbox':
          return value ? 'Yes' : 'No';
        case 'objects':
        case 'object':
          return JSON.stringify(value);
        default:
          return value;
      }
    },
  },
};
</script>

<style scoped>
.confirmation-step {
  margin: 2rem 0;
}

.confirmation-field {
  margin-bottom: 1rem;
}

.confirmation-field strong {
  margin-right: 0.5rem;
}
</style>

