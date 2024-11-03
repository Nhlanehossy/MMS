<template>
  <div class="form-group">
    <a-form-item :label="title">
      <a-switch
        :id="name"
        :name="name"
        :checked="value"
        @change="updateValue"
      />
    </a-form-item>
  </div>
</template>

<script>
import { Switch as ASwitch, FormItem as AFormItem } from 'ant-design-vue';

export default {
  name: 'CheckboxInput',
  components: {
    ASwitch,
    AFormItem,
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
      type: Boolean,
      required: true
    }
  },
  methods: {
    updateValue(checked) {
      this.$emit('update:value', checked);
    }
  }
};
</script>

<style scoped>
</style>
