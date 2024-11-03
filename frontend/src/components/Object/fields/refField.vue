<template>
  <div class="ref-field">
    <span class="ref-label">{{ displayValue }}</span>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import refOptionsService from "@/executables/refOptionsService";

export default {
  name: 'RefField',
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
    },
  },
  setup(props) {
    const loading = ref(true);
    const options = ref([]);

    const fetchOptions = async () => {
      try {
        loading.value = true;
        options.value = await refOptionsService.getRefOptions(
          props.field.resource,
          props.field.field
        );
      } catch (error) {
        console.error('Error fetching ref options:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchOptions();
    });

    const displayValue = computed(() => {
      const selectedOption = options.value.find(option => option.id === props.value);
      return selectedOption ? selectedOption.name : props.value;
    });

    return {
      loading,
      options,
      displayValue,
    };
  },
}
</script>

<style scoped>
.ref-field {
  width: 100%;
}
.ref-label {
}
</style>