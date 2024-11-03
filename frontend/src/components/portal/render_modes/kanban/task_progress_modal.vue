<template>
    <SharedModal title="Task Progress" @close="$emit('close')">
      <apexchart type="radialBar" :options="chartOptions" :series="series"></apexchart>
    </SharedModal>
  </template>
  
  <script>
  import VueApexCharts from 'vue3-apexcharts'
  import SharedModal from './shared_modal.vue';
  
  export default {
    components: {
      apexchart: VueApexCharts,
      SharedModal
    },
    props: ['task'],
    computed: {
      series() {
        const completedSubtasks = this.task.subtasks.filter(st => st.done).length;
        const totalSubtasks = this.task.subtasks.length;
        return [totalSubtasks > 0 ? (completedSubtasks / totalSubtasks * 100) : 0];
      },
      chartOptions() {
        return {
          chart: {
            height: 350,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '70%',
              }
            },
          },
          labels: ['Progress'],
          colors: ['#10B981'], // Tailwind CSS green-500
        };
      }
    }
  }
  </script>