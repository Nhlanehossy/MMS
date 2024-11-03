<template>
  <div class="object-field-display">
    <a-descriptions :title="field.title" bordered>
      <a-descriptions-item v-for="(val, key) in value" :key="key" :label="key">
        <template v-if="typeof val === 'object' && val !== null">
          <ObjectField :field="{ title: key }" :value="val" />
        </template>
        <template v-else>
          {{ val }}
        </template>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { Descriptions } from 'ant-design-vue';

export default {
  name: 'ObjectField',
  components: {
    ADescriptions: Descriptions,
    ADescriptionsItem: Descriptions.Item,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.object-field-display {
  margin-bottom: 16px;
}
</style>
