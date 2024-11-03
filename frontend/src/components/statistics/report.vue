<template>
    <div class="report-generator p-10">   
      <div class="mb-4">
        <select 
          id="resourceSelect" 
          v-model="selectedResource" 
          @change="generateReport" 
          class="w-full p-2 border rounded"
        >
          <option value="">-- Select a resource --</option>
          <option v-for="resource in resourcesWithStatus" :key="resource.name" :value="resource.name">
            {{ resource.label }}
          </option>
        </select>
      </div>
  
      <div v-if="loading" class="text-center">
        Loading report...
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        {{ error }}
      </div>
      <div v-else-if="selectedResource">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-cardLight border-t-4 border-secondary rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold mb-2">{{ selectedResourceLabel }} Summary</h3>
            <p class="text-3xl font-bold mb-2">Total: {{ totalCount }}</p>

          </div>
          <div v-for="(distribution, index) in distributions" :key="index" class="bg-cardLight border-t-4 border-secondary rounded-lg shadow-md p-4">
            <h3 class="text-lg font-semibold mb-2">{{ distribution.title }}</h3>
            <ul>
              <li v-for="(value, key) in distribution.data" :key="key" class="flex justify-between">
                <span>{{ key }}:</span>
                <span class="font-bold">{{ value }}</span>
              </li>
            </ul>
          </div>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(chart, index) in charts" :key="index" class="bg-white rounded-lg shadow-md p-4">
            <highcharts :options="chart.options"></highcharts>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import Highcharts from 'highcharts';
  import HighchartsVue from 'highcharts-vue';
  
  import { getFilteredResources } from "../../utils/accessControl";
  
  export default defineComponent({
    name: 'ReportGenerator',
    components: {
      highcharts: HighchartsVue.Chart
    },
    setup() {
      const resources = ref([]);
      const selectedResource = ref('');
      const selectedResourceLabel = ref('');
      const charts = ref([]);
      const distributions = ref([]);
      const totalCount = ref(0);
      const associatedModules = ref({});
      const loading = ref(false);
      const error = ref(null);
  
      const resourcesWithStatus = computed(() => {
        return resources.value.filter(resource => 
          findStatusFields(resource.schema).length > 0
        );
      });
  
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
  
      const generateReport = async () => {
        if (!selectedResource.value) return;
  
        loading.value = true;
        error.value = null;
        charts.value = [];
        distributions.value = [];
        associatedModules.value = {};
  
        try {
          const resource = resources.value.find(r => r.name === selectedResource.value);
          selectedResourceLabel.value = resource.label;
          const statusFields = findStatusFields(resource.schema);
          const mainData = await fetchData(resource.name);
          totalCount.value = mainData.length;
  
          // Count associated modules
          mainData.forEach(item => {
            if (item.module) {
              associatedModules.value[item.module] = (associatedModules.value[item.module] || 0) + 1;
            }
          });
  
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
              distributions.value.push({
                title: `${statusField.title} Distribution`,
                data: statusCounts
              });
            }
          }
  
          if (charts.value.length === 0) {
            error.value = "No chart data available for this resource.";
          }
        } catch (err) {
          error.value = "An error occurred while generating the report.";
          console.error("Error in generateReport:", err);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(async () => {
        try {
          const roleId = localStorage.getItem("role");
          resources.value = await getFilteredResources(roleId);
        } catch (err) {
          error.value = "An error occurred while loading resources.";
          console.error("Error in onMounted:", err);
        }
      });
  
      return { 
        resources, 
        resourcesWithStatus,
        selectedResource,
        selectedResourceLabel, 
        charts, 
        distributions,
        totalCount,
        associatedModules,
        loading, 
        error, 
        generateReport 
      };
    }
  });
  </script>