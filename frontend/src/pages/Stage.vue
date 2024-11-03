<template>
  <Dashboard 
    :blockConfigs="config.blockConfigs"
    :layout="config.layout"
    :inititalData="config.initialData"
  />
</template>

<script setup>
import Dashboard from './dashboard.vue';
import dashboardConfig from './config';
const config = dashboardConfig;
</script>