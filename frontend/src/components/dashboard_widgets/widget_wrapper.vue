<template>
    <div class="widget-wrapper">
      <div class="header mx-2 mb-2">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <action_dispatcher :resource="{
              actions:[
                {
                  name:'ArchiveAction',
                  icon:'fa fa-archive',
                  label:'Archive'               
                },
                {
                  name: 'FavoriteAction',
                  icon: 'pi pi-star',
                  label: 'Favorite',
                }
              ]
            }" :item="{}"  />
      </div>
      <slot></slot>
    </div>
  </template>
  
  <script>
  import action_dispatcher  from '../action_dispatcher.vue';
  export default {
    name: 'WidgetWrapper',
    components: {
      action_dispatcher
    },
    props: {
      title: {
        type: String,
        required: true,
      },
    },
    methods: {
      onSeeMoreClick() {
        // Logic for see more action
        this.$emit('see-more');
      },
    },
  };
  </script>
  
  <style scoped>
  .widget-wrapper {
    border-radius: 8px;
    width: 100%;
    height: 100%;
    margin: 0;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .see-more {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
  }
  
  .see-more:hover {
    background-color: #0056b3;
  }
  </style>
  