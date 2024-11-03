<template>
  <div :style="gridStyle" class="grid-layout">
    <div
      v-for="(item, index) in layout"
      :key="index"
      class="grid-item"
      :style="getItemStyle(item)"
    >
      <slot :name="item.name" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rows: {
      type: Number,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
    layout: {
      type: Array,
      required: true,
    },
    rowHeight: {
      type: String,
      default: 'minmax(min-content, auto)' // This helps with dynamic sizing
    },
    gap: {
      type: String,
      default: '10px'
    }
  },

  computed: {
    gridStyle() {
      return {
        display: 'grid',
        gridTemplateRows: `repeat(${this.rows}, ${this.rowHeight})`,
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
        gap: this.gap,
        minHeight: '0', // Prevents unnecessary expansion
        width: '100%',
      };
    },
  },

  methods: {
    getItemStyle(item) {
      return {
        gridRow: `${item.rowStart} / span ${item.rowSpan}`,
        gridColumn: `${item.colStart} / span ${item.colSpan}`,
        padding: '10px',
        boxSizing: 'border-box',
        minHeight: '0', // Prevents unnecessary expansion
        overflow: 'auto', // Handles overflow content
      };
    },
  },
};
</script>

<style scoped>
.grid-layout {
  width: 100%;
  height: auto;
  margin: 2px;
  min-height: 0; /* Prevents unnecessary expansion */
}

.grid-item {
  min-height: 0; /* Prevents unnecessary expansion */
  height: 100%;
}

/* Mobile responsiveness */
@media screen and (max-width: 768px) {
  .grid-layout {
    display: grid !important;
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
    gap: 10px !important;
  }

  .grid-item {
    grid-column: 1 !important;
    grid-row: auto !important;
  }
}
</style>