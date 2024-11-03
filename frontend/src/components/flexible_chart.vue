<template>
    <div class="card mt-7">
      <apexchart 
        :type="chartType" 
        :options="chartOptions" 
        :series="processedSeries"
      ></apexchart>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  export default defineComponent({
    name: 'FlexibleChart',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
      chartType: {
        type: String,
        default: 'line',
        validator: (value) => [
          'line', 
          'bar', 
          'pie', 
          'donut', 
          'scatter', 
          'area', 
          'radar', 
          'heatmap'
        ].includes(value),
      },
      series: {
        type: Array,
        required: true,
        // Expects format: [{ name: 'Series1', data: [{x: 1, y: 2}, ...] }]
        // Or for pie/donut: [{ name: 'Series1', data: 23 }, ...]
      },
      chartTitle: {
        type: String,
        default: '',
      },
      xAxisTitle: {
        type: String,
        default: '',
      },
      yAxisTitle: {
        type: String,
        default: '',
      },
      dataLabels: {
        type: Boolean,
        default: false,
      },
      colors: {
        type: Array,
        default: () => [],
      },
      height: {
        type: [String, Number],
        default: 'auto'
      },
      stacked: {
        type: Boolean,
        default: false
      },
      horizontal: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const processedSeries = computed(() => {
        if (['pie', 'donut'].includes(props.chartType)) {
          return props.series.map(item => item.data);
        }
        return props.series;
      });
  
      const chartOptions = computed(() => ({
        chart: {
          type: props.chartType,
          height: props.height,
          stacked: props.stacked,
        },
        title: {
          text: props.chartTitle,
          align: 'center',
        },
        xaxis: {
          title: {
            text: props.xAxisTitle,
          },
        },
        yaxis: {
          title: {
            text: props.yAxisTitle,
          },
        },
        plotOptions: {
          bar: {
            horizontal: props.horizontal,
          },
        },
        dataLabels: {
          enabled: props.dataLabels,
        },
        colors: props.colors.length > 0 ? props.colors : undefined,
      }));
  
      return {
        chartOptions,
        processedSeries,
      };
    },
  });
  </script>