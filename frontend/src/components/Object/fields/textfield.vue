<template>
  <div class="common-text" ref="container"> <!-- Add ref for easier access -->
    <p v-if="field.type === 'status'" 
       class="status-text"
       :style="statusStyle">
      {{ getStatusLabel }}
    </p>
    <p v-else-if="field.type === 'number'" :class="'text-xl'" >
      {{ value }}
    </p>   
    
    
    <p 
      v-else 
      :class="field.type === 'price' ? 'font-bold text-primary' : ''" 
      ref="textElement" 
      :style="shrinkTextStyle">
      {{ field.type === 'price' ? 'MWK' : '' }}{{ value }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fontSize: 16, // Default font size (adjust as necessary)
    };
  },
  computed: {
    statusStyle() {
      if (this.field.type === 'status') {
        const option = this.field.options.find(opt => opt.value === this.value);
        if (option) {
          return {
            backgroundColor: this.hexToRgba(option.color, 0.2),
            color: option.color,
            border: `1px solid ${option.color}`,
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
          };
        }
      }
      return {};
    },
    getStatusLabel() {
      if (this.field.type === 'status') {
        const option = this.field.options.find(opt => opt.value === this.value);
        return option ? option.label : this.value;
      }
      return this.value;
    },
    shrinkTextStyle() {
      return {
        fontSize: `${this.fontSize}px`,
        lineHeight: '1.2',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      };
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.shrinkTextToFit();
    });
  },
  methods: {
    hexToRgba(hex, alpha = 1) {
      let hexValue = hex.replace('#', '');
      if (hexValue.length === 3) {
        hexValue = hexValue.split('').map(char => char + char).join('');
      }
      const r = parseInt(hexValue.substr(0, 2), 16);
      const g = parseInt(hexValue.substr(2, 2), 16);
      const b = parseInt(hexValue.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    shrinkTextToFit() {
      const container = this.$refs.container;
      const text = this.$refs.textElement;

      // Check if both container and text elements exist
      if (container && text) {
        while (text.scrollWidth > container.clientWidth && this.fontSize > 10) {
          this.fontSize--;
        }
      } else {
        console.error("Container or text element not found");
      }
    }
  }
};
</script>

<style scoped>
.status-text {
  margin: 0;
  font-weight: 500;
  text-transform: capitalize;
}

.common-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
}
</style>
