<template>
  <div>
    <label :for="name">{{ title }}</label>
    <input
      type="number"
      :id="name"
      :name="name"
      :value="value"
      @input="updateValue"
      :required="required"
      class="form-control modern-input"
    />
  </div>
</template>

<style scoped>
/* Reset default number input styles */
.form-control[type='number'] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 100%;
}

/* Remove up/down arrows from number input */
.form-control[type='number']::-webkit-inner-spin-button,
.form-control[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Style for focused number input */
.form-control[type='number']:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

/* Style for disabled number input */
.form-control[type='number']:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* Style for number input placeholder */
.form-control[type='number']::placeholder {
  color: #999;
}
</style>

<script>
export default {
  name: 'NumberInput',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
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
