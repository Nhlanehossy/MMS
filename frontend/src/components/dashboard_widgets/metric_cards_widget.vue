<template>
  <div class="metric-cards-widget">
    <div class="metric-cards-container">
      <ResourceRenderer
        v-for="(metric, index) in widgetProps.metrics"
        :key="index"
        :resource="getMetricResource(metric)"
        :displayData="getMetricDisplayData(metric)"
        :layout="metricLayout"
        :showHeading="false"
        class="card"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import objectrenderer from '../Object/objectrenderer.vue';

export default defineComponent({
  name: 'MetricCardsWidget',
  components: {
    ResourceRenderer: objectrenderer
  },
  props: {
    widgetProps: {
      type: Object,
      required: true
    }
  },
  computed: {
    metricLayout() {
      return {
        rows: 2,
        columns: 2,
        fields: {
          icon: { rowStart: 1, colStart: 1, rowSpan: 2, colSpan: 1, alignment: 'middle-center' },
          label: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'bottom-left' },
          value: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        }
      }
    }
  },
  methods: {
    getMetricResource(metric) {
      return {
        name: 'metric',
        schema: [
          { name: 'icon', type: 'icon' },
          { name: 'label', type: 'text' },
          { name: 'value', type: 'text' },
        ]
      }
    },
    getMetricDisplayData(metric) {
      return {
        icon: metric.icon,
        label: metric.label,
        value: metric.value,
      }
    }
  }
})
</script>

<style scoped>
.metric-cards-widget {
  font-family: 'Arial', sans-serif;
}

.metric-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .metric-cards-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .metric-cards-container {
    grid-template-columns: 1fr;
  }
}
</style>