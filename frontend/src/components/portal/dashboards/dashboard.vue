<template>
  <BlockGrid 
    :blockConfigs="mergedBlockConfigs" 
    :layout="mergedLayout" 
    :rows="rows" 
    :columns="columns" 
    :rowHeight="rowHeight" 
    :gap="gap"
    @blockUpdate="handleBlockUpdate" 
  />
</template>

<script setup>
import BlockGrid from '@/components/BlockGrid.vue';
import { computed } from 'vue';

const props = defineProps({
  // Grid layout props
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
    default: 80
  },
  gap: {
    type: String,
    default: '0px'
  },
  
  // Dashboard content configuration
  resources: {
    type: Object,
    default: () => ({})  // Allow passing custom resources
  },
  blockConfigs: {
    type: Array,
    default: () => ([])  // Allow passing custom block configs
  },
  layout: {
    type: Array,
    default: () => ([])  // Allow passing custom layout
  },
  initialData: {
    type: Object,
    default: () => ({})  // Allow passing initial data for blocks
  }
});

const emits = defineEmits(['blockUpdate']);

// Merge provided resources with defaults
const mergedBlockConfigs = computed(() => {
  // Merge provided blockConfigs with defaults or use provided ones entirely
  return  props.blockConfigs 
});

const mergedLayout = computed(() => {
  // Merge provided layout with defaults or use provided one entirely
  return  props.layout 
});

const handleBlockUpdate = (update) => {
  emits('blockUpdate', update);
};


</script>