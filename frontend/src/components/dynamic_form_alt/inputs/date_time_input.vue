<template>
  <div class="mb-4">
    <label :for="name" class="block mb-2 font-bold">{{ title }}</label>
    <div class="flex items-center">
      <a-date-picker
        v-if="type === 'date' || type === 'datetime'"
        :id="name"
        :name="name"
        :value="dateValue"
        @change="handleDateChange"
        :show-time="type === 'datetime'"
        :format="type === 'datetime' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'"
        class="w-full"
      />
      <a-time-picker
        v-if="type === 'time'"
        :id="name"
        :name="name"
        :value="timeValue"
        @change="handleTimeChange"
        format="HH:mm"
        class="w-full"
      />
    </div>
    <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { DatePicker, TimePicker } from 'ant-design-vue';
import dayjs from 'dayjs';

export default {
  name: 'DateTimeInput',
  components: {
    ADatePicker: DatePicker,
    ATimePicker: TimePicker,
  },
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
      required: true,
      validator: (value) => ['date', 'time', 'datetime'].includes(value)
    },
    initialValue: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: this.initialValue ? dayjs(this.initialValue) : null,
      errorMessage: '',
    };
  },
  computed: {
    dateValue() {
      return this.type === 'time' ? null : this.value;
    },
    timeValue() {
      return this.type === 'time' ? this.value : null;
    },
  },
  methods: {
    handleDateChange(date, dateString) {
      if (date) {
        this.value = date;
        this.errorMessage = '';
        this.$emit('update:value', date.toISOString());
      } else {
        this.value = null;
        this.errorMessage = 'Invalid date format';
        this.$emit('update:value', null);
      }
    },
    handleTimeChange(time, timeString) {
      if (time) {
        this.value = time;
        this.errorMessage = '';
        this.$emit('update:value', time.format('HH:mm'));
      } else {
        this.value = null;
        this.errorMessage = 'Invalid time format';
        this.$emit('update:value', null);
      }
    },
  },
};
</script>
