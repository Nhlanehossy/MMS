<template>
    <div class="chart-widget">
      <apexchart
        :type="widgetProps.chartType"
        :options="chartOptions"
        :series="widgetProps.series"
        :height="widgetProps.height || 350"
        :width="widgetProps.width || '100%'"
      />
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import VueApexCharts from 'vue3-apexcharts'
  
  export default defineComponent({
    name: 'ChartWidget',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
      widgetProps: {
        type: Object,
        required: true
      }
    },
    computed: {
      chartOptions() {
        const rootStyles = getComputedStyle(document.documentElement);
        const backgroundColor = rootStyles.getPropertyValue('--cardLight').trim();
        return {
          chart: {
            id: this.widgetProps.id || 'chart',
            toolbar: this.widgetProps.toolbar || {
              show: true
            },
            zoom: this.widgetProps.zoom || {
              enabled: true
            },
            backgroundColor: backgroundColor,
          },
          xaxis: this.widgetProps.xaxis || {},
          yaxis: this.widgetProps.yaxis || {},
          title: {
            text: this.widgetProps.title,
            align: 'center'
          },
          theme: this.widgetProps.theme || {
            mode: 'light'
          },
          ...this.widgetProps.additionalOptions
        }
      }
    }
  })
  </script>