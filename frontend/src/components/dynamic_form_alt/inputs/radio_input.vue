<template>

    <label>{{ title }}</label>
    <div class="form-grid">
      <div v-for="option in options" :key="option.value" class="form-check">
        <input
          class="form-check-input"
          type="radio"
          :id="`${name}-${option.value}`"
          :name="name"
          :value="option.value"
          :checked="value === option.value"
          @change="updateValue"
        />
        <label class="form-check-label" :for="`${name}-${option.value}`">
          {{ option.label }}
        </label>
      </div>
    </div>

</template>

<script>
export default {
  name: 'RadioInput',
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
    updateValue(event) {
      this.$emit('update:value', event.target.value);
    },
  },
};
</script>

<style scoped>
/* Reset default radio input styles */
.form-check-input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ccc;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
  top: 1px; /* Adjust this value to vertically center align */
}

/* Style for checked radio input */
.form-check-input[type="radio"]:checked {
  border-color: #4CAF50;
}

/* Style for checked radio input (inner circle) */
.form-check-input[type="radio"]:checked:after {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4CAF50;
  margin: 2px;
}

/* Label styles */
.form-check-label {
  margin-left: 8px;
  cursor: pointer;
}

/* Grid layout styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.form-check {
  display: flex;
  align-items: center;
}
</style>
