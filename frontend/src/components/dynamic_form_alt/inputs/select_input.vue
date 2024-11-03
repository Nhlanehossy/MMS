<template>
  <div class="form-group">
    <label :for="name">{{ title }}</label><br />
    <a-select
      :id="name"
      :value="value"
      @change="updateValue"
      :options="options"
      class="modern-input"
      :placeholder="`Select ${title}`"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectInput',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    initialData: {
      type: [String, Number],
      default: null,
    },
  },
  methods: {
    updateValue(selectedValue) {
      this.$emit('update:value', selectedValue);
    },
  },
};
</script>

<style scoped>
.modern-input {
  width: 100%;
}
</style>
