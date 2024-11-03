<template>
  <div class="object-array-field-display">
    <a-collapse>
      <a-collapse-panel v-for="(item, index) in value" :key="index" :header="`Item ${index + 1}`">
        <div v-for="(val, key) in item" :key="key">
          <strong>{{ key }}:</strong> {{ val }}
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import { Collapse } from 'ant-design-vue';

export default {
  name: 'ObjectArrayField',
  components: {
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
};
</script>
