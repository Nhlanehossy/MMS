<template>
  <div class="form-group">
    <label class="font-bold" :for="field.field">{{ field.title }}</label><br />
    <a-select
      class="modern-input w-full"
      :id="field.field"
      :value="value"
      :disabled="loading"
      :placeholder="loading ? 'Loading...' : 'Select an option'"
      @change="updateValue"
      :options="selectOptions"
    >
      <template v-if="options.length === 0 && !loading" #notFoundContent>
        No options available
      </template>
    </a-select>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import refOptionsService from "@/executables/refOptionsService";

export default {
  name: 'RefSelectInput',
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      required: true,
    },
  },
  setup(props, { emit }) {
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

    const updateValue = (selectedValue) => {
      emit('update:value', selectedValue);
    };

    const selectOptions = computed(() =>
      options.value.map(option => ({ label: option.name, value: option.id }))
    );

    return {
      loading,
      options,
      selectOptions,
      updateValue,
    };
  },
};
</script>

<style scoped>
/* Reset default select styles */
.form-group {
  margin-bottom: 1rem;
}
</style>
