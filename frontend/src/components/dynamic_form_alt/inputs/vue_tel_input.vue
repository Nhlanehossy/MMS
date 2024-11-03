<template>
  <div class="form-group">
    <a-form-item :label="title">
      <a-input-group compact>
        <a-select
          style="width: 20%"
          v-model:value="countryCode"
          @change="updateValue"
        >
          <a-select-option value="+1">+1</a-select-option>
          <a-select-option value="+44">+44</a-select-option>
          <a-select-option value="+91">+91</a-select-option>
          <!-- Add more country codes as needed -->
        </a-select>
        <a-input
          style="width: 80%"
          :id="name"
          :name="name"
          v-model:value="phoneNumber"
          @change="updateValue"
          placeholder="Enter phone number"
        />
      </a-input-group>
    </a-form-item>
  </div>
</template>

<script>
import { Input, Select, Form } from 'ant-design-vue';

export default {
  name: 'TelephoneInput',
  components: {
    AInput: Input,
    AInputGroup: Input.Group,
    ASelect: Select,
    ASelectOption: Select.Option,
    AFormItem: Form.Item,
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
    value: {
      type: String,
      required: true
    },
    initialData: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      countryCode: '+1',
      phoneNumber: '',
    };
  },
  created() {
    // Parse the initial value if it exists
    if (this.value) {
      const match = this.value.match(/^(\+\d+)\s*(.*)$/);
      if (match) {
        this.countryCode = match[1];
        this.phoneNumber = match[2];
      } else {
        this.phoneNumber = this.value;
      }
    } else {
      this.phoneNumber = this.initialData; // Add this line
    }
  },
  methods: {
    updateValue() {
      const fullNumber = `${this.countryCode} ${this.phoneNumber}`.trim();
      this.$emit('update:value', fullNumber);
    }
  }
}
</script>

<style scoped>
.vue-tel-input {
  margin-top: 5px;
}
</style>
