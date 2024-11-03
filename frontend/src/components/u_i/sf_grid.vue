<template>
    <div :class="gridClasses">
      <div
        v-for="(column, index) in columnData"
        :key="index"
        :class="columnClasses(column)"
      >
        <slot :name="`column-${index}`" :column="column">
          {{ column.content }}
        </slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GridWrapper',
    props: {
      columns: {
        type: Array,
        required: true,
      },
      gutter: {
        type: String,
        default: 'md',
        validator: (value) => {
          return ['sm', 'md', 'lg'].includes(value);
        },
      },
      alignment: {
        type: String,
        default: 'top',
        validator: (value) => {
          return ['top', 'middle', 'bottom'].includes(value);
        },
      },
    },
    computed: {
      columnData() {
        return this.columns.map((column) => ({
          ...column,
          size: column.size || 'auto',
        }));
      },
      gridClasses() {
        return [
          'grid',
          `gap-${this.gutter}`,
          'grid-cols-1',
          'sm:grid-cols-2',
          'md:grid-cols-3',
          'lg:grid-cols-4',
          'xl:grid-cols-5',
        ];
      },
    },
    methods: {
      columnClasses(column) {
        return [
          column.size === 'auto' ? '' : `col-span-${column.size}`,
          `self-${this.alignment}`,
          column.classes,
        ];
      },
    },
  };
  </script>