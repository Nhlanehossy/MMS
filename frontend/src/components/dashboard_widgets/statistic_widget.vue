<template>
    <div class="statistic-widget" :style="widgetStyle">
      <div class="statistic-content">
        <div class="statistic-icon" v-if="widgetProps.icon">
          <i :class="widgetProps.icon"></i>
        </div>
        <div class="statistic-data">
          <p class="statistic-value" :style="valueStyle">{{ formattedValue }}</p>
          <p class="statistic-label">{{ widgetProps.label }}</p>
          <p v-if="widgetProps.change !== undefined" class="statistic-change" :class="changeClass">
            {{ changePrefix }}{{ widgetProps.change }}%
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue'
  
  export default defineComponent({
    name: 'StatisticWidget',
    props: {
      widgetProps: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const formattedValue = computed(() => {
        if (props.widgetProps.format === 'currency') {
          return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: props.widgetProps.currency || 'USD' 
          }).format(props.widgetProps.value)
        }
        if (props.widgetProps.format === 'number') {
          return new Intl.NumberFormat('en-US').format(props.widgetProps.value)
        }
        return props.widgetProps.value
      })
  
      const changeClass = computed(() => {
        if (props.widgetProps.change > 0) return 'positive-change'
        if (props.widgetProps.change < 0) return 'negative-change'
        return ''
      })
  
      const changePrefix = computed(() => {
        if (props.widgetProps.change > 0) return '+'
        if (props.widgetProps.change < 0) return ''
        return ''
      })
  
      const widgetStyle = computed(() => ({
        backgroundColor: props.widgetProps.backgroundColor || '#ffffff',
        color: props.widgetProps.color || '#000000',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }))
  
      const valueStyle = computed(() => ({
        fontSize: props.widgetProps.valueFontSize || '2rem',
        fontWeight: 'bold',
        color: props.widgetProps.valueColor || 'inherit'
      }))
  
      return {
        formattedValue,
        changeClass,
        changePrefix,
        widgetStyle,
        valueStyle
      }
    }
  })
  </script>
  
  <style scoped>
  .statistic-content {
    display: flex;
    align-items: center;
  }
  
  .statistic-icon {
    font-size: 2rem;
    margin-right: 15px;
  }
  
  .statistic-label {
    font-size: 1rem;
    color: #666;
  }
  
  .positive-change {
    color: green;
  }
  
  .negative-change {
    color: red;
  }
  </style>