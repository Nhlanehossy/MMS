<template>
  <div class="form-group">
    <label :for="name">{{ title }}</label>
    <input
      type="range"
      :id="name"
      :name="name"
      :value="value"
      @input="updateValue"
      :min="min"
      :max="max"
      class="form-control"
    />
    <span>{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'RangeInput',
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
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    initialData: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateValue(event) {
      const value = Number(event.target.value)
      this.$emit('update:value', isNaN(value) ? this.initialData : value)
    }
  }
}
</script>

<style scoped>
/* Reset default range input styles */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
}

/* Styling for the range track */
input[type='range']::-webkit-slider-runnable-track {
  background-color: #ccc;
  height: 8px;
  border-radius: 4px;
}

input[type='range']::-moz-range-track {
  background-color: #ccc;
  height: 8px;
  border-radius: 4px;
}

/* Styling for the range thumb */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background-color: #4caf50;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-top: -6px;
}

input[type='range']::-moz-range-thumb {
  background-color: #4caf50;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: none;
}

/* Styling for the range value display */
input[type='range'] + span {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}
</style>

