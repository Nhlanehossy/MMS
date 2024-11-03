<template>
  <div>
    <label :for="name">{{ title }}</label>
    <a-textarea
      class="modern-input"
      :id="name"
      :name="name"
      :value="value"
      @input="updateValue"
      :placeholder="`Enter ${title}...`"
      :rows="rows"
    />
  </div>
</template>

<script>
export default {
  name: 'TextareaInput',
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
    },
    rows: {
      type: Number,
      default: 3,
    },
    initialData: {
      type: String,
      default: '',
    },
  },
  methods: {
    updateValue(event) {
      this.$emit('update:value', event.target.value);
    },
  },
};
</script>

<style scoped>
/* Optional styling */
.modern-input {
  margin-top: 5px;
}
</style>
