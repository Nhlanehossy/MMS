<template>
  <div class="form-group">
    <label :for="name">{{ title }}</label>
    <a-time-picker
      class="modern-input"
      :id="name"
      :value="value ? moment(value, 'HH:mm') : null"
      @change="updateValue"
      format="HH:mm"
      :placeholder="`Select ${title}`"
    />
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'TimeInput',
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
    initialData: {
      type: String,
      default: '00:00',
    },
  },
  methods: {
    updateValue(time, timeString) {
      this.$emit('update:value', timeString);
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
