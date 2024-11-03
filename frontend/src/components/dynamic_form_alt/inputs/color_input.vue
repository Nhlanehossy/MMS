<template>
  <div class="form-group">
    <label :for="name">{{ title }}</label>
    <input
      type="color"
      class="form-control"
      :id="name"
      :name="name"
      :value="value"
      @input="updateValue"
    />
  </div>
</template>

<script>
export default {
  name: 'ColorInput',
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
      type: String,
      required: true,
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:value', event.target.value);
    },
  },
};
</script>

<style scoped>
</style>
