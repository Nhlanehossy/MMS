<template>
  <div class="quick-stats-section">
    <h2 class="text-2xl font-bold">{{ translationKeys.QuickStats }}</h2>
    <div v-if="loading" class="text-center">
      <a-skeleton active />
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card" v-for="(chart, index) in charts" :key="index">
        <highcharts :options="chart.options"></highcharts>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import HighchartsVue from 'highcharts-vue';
import { Skeleton } from 'ant-design-vue';  // Import Skeleton from Ant Design
import { translationKeys } from '@/executables/translation';
import { getFilteredResources } from "../../../executables/accessControl";

export default defineComponent({
  name: 'QuickStatsSection',
  components: {
    highcharts: HighchartsVue.Chart,
    'a-skeleton': Skeleton  // Register the Skeleton component from Ant Design
  },
  data() {
    return {
      translationKeys: translationKeys
    }
  },
  setup() {
    const Resources = ref([]);
    const charts = ref([]);
    const loading = ref(true);
    const error = ref(null);

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
      const rootStyles = getComputedStyle(document.documentElement);

      const primaryColor = rootStyles.getPropertyValue('--primary').trim();
      const secondaryColor = rootStyles.getPropertyValue('--tertiary').trim();
      const textColor = rootStyles.getPropertyValue('--menubg').trim();
      const backgroundColor = rootStyles.getPropertyValue('--cardLight').trim();
      const backgroundHoverColor = rootStyles.getPropertyValue('--backgroundHover').trim();

      return {
        options: {
          chart: {
            type,
            backgroundColor: backgroundColor
          },
          title: {
            text: title,
            style: {
              color: textColor
            }
          },
          series: [{
            data
          }],
          colors: [primaryColor, secondaryColor],
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                  color: textColor
                }
              }
            },
            bar: {
              dataLabels: { enabled: true },
              showInLegend: true,
              colorByPoint: true,
              colors: [primaryColor, secondaryColor, backgroundHoverColor],
            }
          }
        }
      };
    };

    const findStatusFields = (schema, prefix = '') => {
      let statusFields = [];
      for (const field of schema) {
        const fullFieldName = prefix ? `${prefix}.${field.name}` : field.name;

        if (field.type === 'ref') {
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

    const processResource = async (resource) => {
      if (!resource.schema || !Array.isArray(resource.schema)) {
        console.log(`Skipping resource ${resource.name} as it doesn't have a valid schema.`);
        return;
      }

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

    onMounted(async () => {
      try {
        const roleId = localStorage.getItem("role");
        Resources.value = await getFilteredResources(roleId);
        for (const resource of Resources.value) {
          if (resource.schema && Array.isArray(resource.schema)) {
            await processResource(resource);
          } else {
            console.log(`Skipping resource ${resource.name} as it doesn't have a valid schema.`);
          }
        }
        if (charts.value.length === 0) {
          error.value = "No chart data available.";
        }
      } catch (err) {
        error.value = "An error occurred while loading the charts.";
        console.error("Error in onMounted:", err);
      } finally {
        loading.value = false;
      }
    });

    return { charts, loading, error };
  }
});
</script>
