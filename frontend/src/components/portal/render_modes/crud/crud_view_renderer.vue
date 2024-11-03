<template>
  <div>


    <div v-if="mode === 'table'">
      <table-view
        :resource="resource"
        :items="items"
        :selectedRows="selectedRows"
        @update:selectedRows="updateSelectedRows"
        @action="handleAction"
      ></table-view>
    </div>
    <div v-else-if="mode === 'grid'">
      <grid-view
        :resource="resource"
        :items="items"
        :selectedRows="selectedRows"
        @update:selectedRows="toggleRowSelection"
        @action="handleAction"
      ></grid-view>
    </div>
    <div v-else-if="mode === 'kanban'">
      <kanban-view
        :resource="resource"
        :items="items"
        :selectedRows="selectedRows"
        :kanbanField="'category'"
        @update:selectedRows="toggleRowSelection"
        @action="handleAction"
      ></kanban-view>
    </div>
    <div v-else-if="mode === 'list'">
      <list-view
        :resource="resource"
        :items="items"
        :selectedRows="selectedRows"
        @update:selectedRows="toggleRowSelection"
        @action="handleAction"
      ></list-view>
    </div>
  </div>
</template>

<script>
import TableView from './table_view.vue';
import GridView from './grid_view.vue';
import ListView from './list_view.vue';
import resourceFunctions from '../../../../executables/actions';
import refOptionsService from '../../../../executables/refOptionsService';
import Swal from 'sweetalert2';

export default {
  components: {
    TableView,
    GridView,
    ListView,
  },
  props: {
    resource: {
      type: Object,
      required: false,
    },
    items: {
      type: Array,
      required: true,
    },
    selectedRows: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      mode: 'table',
      refOptions: [],
    };
  },
  mounted() {
    
    if (this.resource.crudType === 'grid') {
      this.mode = 'grid';
    }else if (this.resource.crudType === 'list') {
      this.mode = 'list';
    }else if (this.resource.crudType === 'kanban') {
      this.mode = 'kanban';
    }else{
      this.mode = 'table';
    }
    
  },
  created() {
    this.fetchRefOptions();
  },
  methods: {
    toggleMode() {
      this.mode = this.mode === 'table' ? 'grid' : 'table';
    },
    getValue(resource, id) {
      const myValue = this.refOptions[resource];

      if (!Array.isArray(myValue)) {
        return null;
      }

      for (const obj of myValue) {
        if (obj.id === id) {
          return obj.name;
        }
      }

      return null;
    },
    async fetchRefOptions() {
      this.refOptions = {};

      for (const field of this.resource.schema) {
        if (field.type === 'ref') {
          this.refOptions[field.name] = await refOptionsService.getRefOptions(
            field.resource,
            field.field
          );
        }
      }
    },
    async handleAction(item, action) {
      const actionConfig = this.resource.actions.find((a) => Object.keys(a)[0] === action);
      if (actionConfig) {
        const actionFunction = resourceFunctions.find((f) => f.key === actionConfig[action]);
        if (actionFunction) {
          try {
            await actionFunction.value({ resource: this.resource.name, id: item.id });
            this.$emit('action', item, action);
          } catch (error) {
            Swal.fire({
              title: 'Error',
              text: `Error performing '${action}' action: ${error.message}`,
              icon: 'error',
              timer: 3000,
              showConfirmButton: false,
            });
          }
        } else {
          console.warn(`'${actionConfig[action]}' function not found in resourceFunctions`);
        }
      } else {
        console.warn(`Unknown action '${action}' for resource '${this.resource.name}'`);
      }
    },
    updateSelectedRows(rows) {
      this.$emit('update:selectedRows', rows);
    },
    toggleRowSelection(id, checked) {
      const updatedRows = checked
        ? [...this.selectedRows, id]
        : this.selectedRows.filter((rowId) => rowId !== id);
      this.$emit('update:selectedRows', updatedRows);
      console.log(this.selectedRows)
    },
  },
};
</script>