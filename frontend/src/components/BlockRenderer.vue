<template>
  <div>
    <component
      v-if="block && getComponent(block.type)"
      :is="getComponent(block.type)"
      v-bind="block.props"
      @error="handleComponentError"
      @update="handleUpdate"
    />
    <div v-else-if="!block" class="error-message">
      No block data provided
    </div>
  </div>
</template>

<script setup>
import { defineProps, markRaw } from 'vue'
import dynamic_form from './portal/render_modes/crud/dynamic_form.vue'
import objectrenderer from './Object/objectrenderer.vue'
import DataGroup from './Object/DataGroup.vue'
import DynamicCrud from './Object/DynamicCrud.vue'
import multi_step_form from './dynamic_form_alt/multi_step_form.vue'
import flexible_chart from './flexible_chart.vue'
const props = defineProps({
  block: {
    type: Object,
    required: true,
    validator: (block) => block.type && typeof block.type === 'string'
  }
})

const COMPONENT_MAP = {
  'dynamic-form': markRaw(dynamic_form),
  'object-renderer': markRaw(objectrenderer),
  'data-group': markRaw(DataGroup),
  'dynamic-crud': markRaw(DynamicCrud),
  'multi-step-form': markRaw(multi_step_form),
  'chart': markRaw(flexible_chart),
}

const getComponent = (type) => {
  const component = COMPONENT_MAP[type]
  if (!component) {
    console.warn(`Unknown component type: ${type}`)
  }
  return component
}

const handleComponentError = (error) => {
  console.error('Component error:', error)
  // Add your error handling logic here
}

const handleUpdate = (data) => {
  // Handle component updates
  emit('update', data)
}
</script>

<style scoped>
.error-message {
  color: red;
  padding: 1rem;
}
</style>