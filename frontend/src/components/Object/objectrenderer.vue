<template>
 
    <div v-if="showHeading" class="mb-4">
      <h2 class="heading">{{ resource.label }}</h2>
    </div>

      <GridLayout  v-else @click="goto()" :rows="layout.rows" :columns="layout.columns" :layout="layoutItems">
        <template v-for="item in layoutItems" :key="item.name" #[item.name]>
          <div class="grid-item-container">
            <template v-if="item.type === 'field'">
              <DynamicFieldRenderer
                :field="getFieldByName(item.name)"
                :value="displayData[item.name]"
                :fallbackType="item.fallbackType || 'text'"
              />
            </template>
            <template v-else-if="item.type === 'action'">
              <action_dispatcher
                v-if="showActions"
                :resource="{ name: resource.name, path: resource.path, schema: resource.schema, actions: item.actions }"
                :item="payload || displayData"
                :orientation="item.orientation || defaultOrientation"
                @click.stop
              />
            </template>
          </div>
        </template>
      </GridLayout>


</template>

<script>
import DynamicFieldRenderer from './fieldrenderer.vue';
import GridLayout from './Gridlayout.vue';
import action_dispatcher from '../action_dispatcher.vue';
import resourceFunctions from '../../executables/actions';

export default {
  name: 'ResourceRenderer',
  components: {
    DynamicFieldRenderer,
    GridLayout,
    action_dispatcher
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
    displayData: {
      type: Object,
      required: true,
    },
    layout: {
      type: Object,
      required: true,
    },
    defaultOrientation: {
      type: String,
      default: 'icons',
    },
    payload: {
      type: Object,
      required: false,
    },
    showHeading: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    layoutItems() {
      const fieldItems = Object.entries(this.layout.fields).map(([name, item]) => ({
        name,
        type: 'field',
        alignment: item.alignment || 'top-left', // Add this line
        ...item,
      }));
      const actionItems = (this.layout.actions || []).map(item => ({
        type: 'action',
        alignment: item.alignment || 'top-left', // Add this line
        ...item,
      }));
      return [...fieldItems, ...actionItems];
    },
  },
  methods: {
    getFieldByName(name) {
      return this.resource.schema.find(field => field.name === name) || { name, type: 'text' };
    },
    goto(){
      const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    const firstPathSegment = currentPath.split('/')[1];
    console.log('First path segment:', firstPathSegment);
    let func;
    if(firstPathSegment==='home'){
      
      if(this.resource.name==='categories'){
        window.location.href=`/home/products?categories=${this.displayData.id}`
        return
      }else{
        func='goToProductView'
      }
    }else{
      func='goToView'
    }
     const payload={}
      payload.resource=this.resource.name;
      payload.path=this.resource.path;
      payload.id=this.displayData.id;
      payload.mode=this.resource.mode;
      payload.fullResource=this.resource;
      payload.router=this.$router;
      payload.route=firstPathSegment

      

     const view= resourceFunctions.find(f=>f.key==func)
     view.value(payload)
    }
  }
};
</script>

