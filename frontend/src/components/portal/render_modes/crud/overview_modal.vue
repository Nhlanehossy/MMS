<template>
  <div>
    <button @click="showModal = true" class="btn-primary">
      <i class="fas fa-chart-line mr-2"></i>{{ translationKeys.Statistics }}</button>

    <modal v-if="showModal" @close="showModal = false">
      <template #header>
        <h2 class="text-2xl font-bold mb-4">{{ translationKeys.QuickStats }}</h2>
      </template>

      <template #body>
        <div v-if="loading" class="text-center">
          Loading charts...
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ error }}
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(chart, index) in charts" :key="index" class="bg-white rounded-lg shadow-md p-4">
            <highcharts :options="chart.options"></highcharts>
          </div>
        </div>
      </template>

      <template #footer>
        <button @click="showModal = false" class="btn btn-secondary">{{ translationKeys.Close }}</button>
      </template>
    </modal>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, defineProps, watch } from 'vue';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import Modal from '../../../Modal.vue';
import { translationKeys } from '@/executables/translation';

export default defineComponent({
  name: 'QuickStatsModal',
  components: {
    highcharts: HighchartsVue.Chart,
    modal: Modal, // Register the Modal component
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      translationKeys: translationKeys
    }
  },
  setup(props) {
    const charts = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const showModal = ref(false);


    const fetchData = async (resource) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resource}`);
        return response.data.data;
      } catch (error) {
        console.error(`Error fetching data for ${resource}:`, error);
        throw error;
      }
    };

    const createChart = (title, data, type) => {
      return {
        options: {
          chart: { type },
          title: { text: title },
          series: [{ data }],
          colors: ['#313133', '#9E7B13', '#1F1F20', '#001f3f'],
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            },
            bar: {
              dataLabels: { enabled: true },
              showInLegend: true,
              colorByPoint: true,
              colors: ['#313133', '#9E7B13', '#1F1F20', '#001f3f'],
            }
          }
        }
      };
    };

    const findStatusFields = (schema, prefix = '') => {
      let statusFields = [];
      for (const field of schema) {
        const fullFieldName = prefix ? `${prefix}.${field.name}` : field.name;

        if (field.isStatus && field.type === 'ref') {
          statusFields.push({ ...field, fullName: fullFieldName });
        }
        if (field.type === 'object' && field.schema) {
          statusFields = statusFields.concat(findStatusFields(field.schema, fullFieldName));
        }
        if (field.type === 'object array' && field.schema) {
          statusFields = statusFields.concat(findStatusFields(field.schema, fullFieldName));
        }
        if (field.type === 'array' && field.items && field.items.schema) {
          statusFields = statusFields.concat(findStatusFields(field.items.schema, `${fullFieldName}[]`));
        }
      }
      return statusFields;
    };

    const processResource = async (resource) => {
      const statusFields = findStatusFields(resource.schema);

      if (statusFields.length > 0) {
        try {
          const mainData = await fetchData(resource.name);

          for (const statusField of statusFields) {
            const refData = await fetchData(statusField.resource);
            const refMap = new Map(refData.map(item => [item.id, item[statusField.field]]));

            const statusCounts = mainData.reduce((acc, item) => {
              const statusId = getNestedValue(item, statusField.fullName);
              if (Array.isArray(statusId)) {
                statusId.forEach(id => {
                  const status = refMap.get(id) || 'Unknown';
                  acc[status] = (acc[status] || 0) + 1;
                });
              } else {
                const status = refMap.get(statusId) || 'Unknown';
                acc[status] = (acc[status] || 0) + 1;
              }
              return acc;
            }, {});

            const chartData = Object.entries(statusCounts).map(([name, y]) => ({ name, y }));

            if (chartData.length > 0) {
              charts.value.push(createChart(`${resource.label} by ${statusField.title}`, chartData, 'pie'));
              charts.value.push(createChart(`${resource.label} Distribution by ${statusField.title}`, chartData, 'bar'));
            }
          }
        } catch (err) {
          console.error(`Error processing resource ${resource.name}:`, err);
        }
      }
    };

    const getNestedValue = (obj, path) => {
      const parts = path.split('.');
      let current = obj;
      for (const part of parts) {
        if (part.endsWith('[]') && Array.isArray(current)) {
          const arrayProp = part.slice(0, -2);
          return current.map(item => item[arrayProp]).flat();
        }
        if (current == null) return undefined;
        current = current[part];
      }
      return current;
    };

    watch(() => props.resource, async (newResource) => {
      loading.value = true;
      charts.value = [];
      error.value = null;

      try {
        await processResource(newResource);
        if (charts.value.length === 0) {
          error.value = "No chart data available.";
        }
      } catch (err) {
        error.value = "An error occurred while loading the charts.";
        console.error("Error processing resource:", err);
      } finally {
        loading.value = false;
      }
    }, { immediate: true });

    return { charts, loading, error, showModal };
  }
});
</script>


<style scoped>
.btn-primary {
  @apply bg-secondary hover:bg-tertiary text-textLight font-medium py-2 px-3 rounded transition duration-150 ease-in-out;
}
</style>