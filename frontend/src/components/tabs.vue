<template>
    <div class="tabs-component">
      <vue-tabs :selected="selectedTab">
        <vue-tab
          v-for="tab in tabs"
          :key="tab.name"
          :title="tab.name"
          :selected="selectedTab === tab.name"
          @click="selectTab(tab.name)"
        >
          <slot :name="tab.name"></slot>
        </vue-tab>
      </vue-tabs>
    </div>
  </template>
  
  <script>
  import { Tabs, Tab } from 'vue3-tabs-component';
  
  export default {
    components: {
      Tabs,
      Tab,
    },
    props: {
      tabs: Array,
      selected: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        selectedTab: this.selected,
      };
    },
    methods: {
      selectTab(tabName) {
        this.selectedTab = tabName;
      },
    },
  };
  </script>
  
  <style scoped>
  .tabs-component {
    margin-bottom: 20px;
  }
  </style>
  