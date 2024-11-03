<template>
  <a-input
    :id="name"
    :name="name"
    :value="value"
    @input="updateValue"
    :required="required"
    :placeholder="`Enter ${title}...`"
    class="text"
  />
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:value', event.target.value);
    }
  }
};
</script>