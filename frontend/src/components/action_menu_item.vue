<template>
    <a-menu-item
      @click="$emit('action-click', item, action.name)"
      :class="['custom-menu-item', { 'delete-action': action.name === 'deleteResource' }]"
    >
      <span :class="['flex items-center', { 'text-red-600': action.name === 'deleteResource' }]">
        <i :class="[action.icon, 'mr-2']"></i>
        {{ action.label }}
      </span>
    </a-menu-item>
  </template>
  
  <script>
  export default {
    name: 'ActionMenuItem',
    props: {
      action: {
        type: Object,
        required: true
      },
      item: {
        type: Object,
        required: true
      }
    },
    emits: ['action-click']
  };
  </script>
  
  <style scoped>
  .custom-menu-item {
    padding: 8px 16px;
    transition: background-color 0.3s;
  }
  .custom-menu-item:hover {
    background-color: #f0f0f0;
  }
  .delete-action {
    margin-top: 8px;
    border-top: 1px solid #e8e8e8;
  }
  .delete-action:hover {
    background-color: #fff1f0;
  }
  </style>