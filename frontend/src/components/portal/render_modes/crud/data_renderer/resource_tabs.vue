<template>
  <div class="w-[100%]">
     <div class="overflow-hidden">
       <!-- Tab headers -->
       <div class="tabs">
         <span
           v-for="tab in tabResources"
           :key="tab.name"
           @click="activeKey = tab.name"
           :class="[
             'tab',
             activeKey === tab.name
               ? 'active'
               : ''
           ]"
         >
           <i :class="tab.icon" class="mr-2"></i>
           {{ tab.label }}
         </span>
       </div>
       <!-- Tab content -->
       <div class="p-4">
         <transition-group name="fade" mode="out-in">
           <div v-if="activeKey === 'home'" key="home">
             <home-component :resource="resource" :initialData="initialData" />
           </div>
           <div v-for="tab in otherTabs" :key="tab.name" v-show="activeKey === tab.name">
             <resource_renderer
               :resource="tab"
               :customFilters="getObjectFilters(tab)"
               class="mt-4"
             />
           </div>
         </transition-group>
       </div>
     </div>
   </div>
 </template>
 
 <script>
 import { ref, computed } from 'vue';
 import { Resources } from '../../../../../data/resources';
 import resource_renderer from '../../../resource_renderer.vue';
 import HomeComponent from './object_renderer.vue';
 
 export default {
   components: {
     resource_renderer,
     HomeComponent
   },
   props: {
     resource: {
       type: Object,
       required: true
     },
     currentID: {
       type: String,
       required: false
     },
     initialData: {
       type: Object,
       required: false,
     },
     resources: {
       type: Array,
       required: true
     }
   },
   setup(props) {
     const activeKey = ref('home');
     const tabResources = computed(() => {
       const homeTabs = [{
         name: 'home',
         label: 'Home',
         icon: 'fas fa-home',
       }];
       const otherTabs = props.resource.tabs
         .map(tab => {
           const resource = props.resources.find(r => r.name === tab.resource);
  
           if (resource) {
             return { ...resource, pivot: tab.pivot };
           }
           return null;
         })
         .filter(Boolean);
       return [...homeTabs, ...otherTabs];
     });
     const otherTabs = computed(() => tabResources.value.slice(1));
     const getObjectFilters = (tab) => {
       return tab.pivot && props.currentID ? { [tab.pivot]: props.currentID } : {};
     };
 
     return {
       activeKey,
       tabResources,
       otherTabs,
       getObjectFilters
     };
   }
 }
 </script>
 
 <style scoped>
 .fade-enter-active,
 .fade-leave-active {
   transition: opacity 0.2s ease;
 }
 .fade-leave-to {
   opacity: 0;
 }
 </style>