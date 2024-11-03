<template>
  <div class="flex-container" :style="containerStyle">
    <div
      v-for="item in transformedLayout"
      :key="item.i"
      class="flex-item"
      :style="getItemStyle(item)"
    >
      <div class="flex-item-content" :style="getContentStyle(item)">
        <slot :name="item.name" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

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
      type: Number,
      default: 44,
    },
    gap: {
      type: String,
      default: '5px',
    },
  },
  setup(props) {
    const containerStyle = computed(() => ({
      display: 'flex',
      flexWrap: 'wrap',
      position: 'relative',
      height: `calc(${props.rows * props.rowHeight}px + ${(props.rows - 1) * parseInt(props.gap)}px)`,
      width: '100%',
      boxSizing: 'border-box',
      padding: props.gap,
      overflow: 'hidden'
    }));

    const transformedLayout = computed(() => {
      return props.layout.map((item, index) => ({
        x: item.colStart - 1,
        y: item.rowStart - 1,
        w: item.colSpan,
        h: item.rowSpan,
        i: index.toString(),
        name: item.name,
        alignment: item.alignment || 'top-left',
      }));
    });

    const getItemStyle = (item) => {
      const columnWidth = 100 / props.columns;
      const gapValue = parseInt(props.gap);
      
      return {
        position: 'absolute',
        left: `calc(${item.x * columnWidth}%)`,
        top: `${item.y * (props.rowHeight + gapValue)}px`,
        width: `calc(${item.w * columnWidth}% - ${gapValue}px)`,
        height: `${(item.h * props.rowHeight) + ((item.h - 1) * gapValue)}px`,
        backgroundColor: '',
        borderRadius: '4px',
        boxSizing: 'border-box',
        maxWidth: '100%',
        maxHeight: '100%'
      };
    };

    const getContentStyle = (item) => {
      const style = {
        height: '100%',
        width: '100%',
        display: 'flex',
        boxSizing: 'border-box',
        maxWidth: '100%',
        maxHeight: '100%'
      };

      switch (item.alignment) {
        case 'top-left':
          style.justifyContent = 'flex-start';
          style.alignItems = 'flex-start';
          break;
        case 'top-center':
          style.justifyContent = 'center';
          style.alignItems = 'flex-start';
          break;
        case 'top-right':
          style.justifyContent = 'flex-end';
          style.alignItems = 'flex-start';
          break;
        case 'middle-left':
          style.justifyContent = 'flex-start';
          style.alignItems = 'center';
          break;
        case 'middle-center':
          style.justifyContent = 'center';
          style.alignItems = 'center';
          break;
        case 'middle-right':
          style.justifyContent = 'flex-end';
          style.alignItems = 'center';
          break;
        case 'bottom-left':
          style.justifyContent = 'flex-start';
          style.alignItems = 'flex-end';
          break;
        case 'bottom-center':
          style.justifyContent = 'center';
          style.alignItems = 'flex-end';
          break;
        case 'bottom-right':
          style.justifyContent = 'flex-end';
          style.alignItems = 'flex-end';
          break;
        default:
          style.justifyContent = 'flex-start';
          style.alignItems = 'flex-start';
      }
      return style;
    };

    return {
      containerStyle,
      transformedLayout,
      getItemStyle,
      getContentStyle,
    };
  },
};
</script>

<style scoped>
.flex-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.flex-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
}

.flex-item-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;
}

.image-container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
}
</style>