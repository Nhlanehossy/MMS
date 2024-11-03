<template>
    <div class="statistics-dashboard">
        <!-- Grid Layout for Statistics -->
        <div class="stats-grid" :style="gridStyle">
            <div v-for="stat in statistics" :key="stat.id" class="stat-item">
                <!-- Card View Statistics -->
                <template v-if="stat.displayType === 'card'">
                    <ResourceRenderer :resource="getResource(stat.resourceName)" :displayData="stat.data"
                        :layout="stat.layout" :showHeading="true" :showActions="false" />
                </template>

                <!-- Chart View Statistics -->
                <template v-if="stat.displayType === 'chart'">
                    <FlexibleChart :resource="stat.resourceName" :requestType="stat.requestType" :params="stat.params"
                        :chartType="stat.chartType" :chartTitle="stat.title" :xAxisTitle="stat.xAxis"
                        :yAxisTitle="stat.yAxis" :dataLabels="stat.showLabels" :colors="stat.colors" />
                </template>
            </div>
        </div>
    </div>
</template>

<script>

import ResourceRenderer from '../Object/objectrenderer.vue';
import FlexibleChart from '../flexible_chart.vue';

export default {
    name: 'DynamicStatistics',
    components: {
        ResourceRenderer,
        FlexibleChart
    },
    props: {
        // Array of resource objects from your system
        resources: {
            type: Array,
            required: true
        },
        // Statistics configuration
        statistics: {
            type: Array,
            required: true,
            validator: stats => stats.every(stat =>
                stat.id &&
                stat.resourceName &&
                stat.displayType &&
                ['card', 'chart'].includes(stat.displayType)
            )
        },
        // Grid layout configuration
        gridColumns: {
            type: Number,
            default: 3
        },
        gridGap: {
            type: String,
            default: '1rem'
        }
    },
    computed: {
        gridStyle() {
            return {
                display: 'grid',
                gridTemplateColumns: `repeat(${this.gridColumns}, 1fr)`,
                gap: this.gridGap
            };
        }
    },
    methods: {
        getResource(resourceName) {
            return this.resources.find(r => r.name === resourceName);
        }
    }
};
</script>

<style scoped>
.statistics-dashboard {
    padding: 1rem;
}

.stat-item {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
}
</style>