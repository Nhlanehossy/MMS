<!-- BlockGrid.vue -->
<template>
  <GridLayout :rows="rows" :columns="columns" :layout="layout" :rowHeight="rowHeight" :gap="gap">
    <template v-for="block in blockConfigs" :key="block.id" #[block.name]>

      <widget_wrapper :title="block.title">
        <BlockRenderer :block="block.config" @update="(data) => handleBlockUpdate(block.name, data)" />
      </widget_wrapper>
    </template>
  </GridLayout>
</template>

<script setup>
import BlockRenderer from './BlockRenderer.vue';
import GridLayout from './GridLayout.vue';
import widget_wrapper from './dashboard_widgets/widget_wrapper.vue';

const props = defineProps({
  blockConfigs: {
    type: Array,
    required: true,
  },
  layout: {
    type: Array,
    required: true,
  },
  rows: {
    type: Number,
    default: 12
  },
  columns: {
    type: Number,
    default: 12
  },
  rowHeight: {
    type: Number,
    default: 60
  },
  gap: {
    type: String,
    default: '10px'
  }
});

const emit = defineEmits(['blockUpdate']);

const handleBlockUpdate = (blockName, data) => {
  emit('blockUpdate', { blockName, data });
};
</script>