<template>
  <div class="p-6 w-full overflow-x-hidden min-h-screen bg-background">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text">{{ resource.label }}</h1>

      <div class="flex gap-4">
        <button @click="showStats = true"
          class="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark flex items-center gap-2">
          <i class="pi pi-chart-bar"></i>
          <span>Statistics</span>
        </button>
        <button v-if="showAddButton" @click="navigateToAdd"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2">
          <i class="pi pi-plus"></i>
          <span>Add {{ resource.label.slice(0, -1) }}</span>
        </button>
      </div>
    </div>

    <div class="flex gap-6 overflow-x-auto">
      <div v-for="column in columns" :key="column.value" class="flex-1 min-w-[300px]">
        <div class="bg-cardLight rounded-lg shadow p-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-text">
              {{ column.label }}
            </h2>
            <span class="px-2 py-1 text-sm bg-background rounded-full text-text">
              {{ itemsByStatus[column.value]?.length || 0 }}
            </span>
          </div>

          <div
            class="min-h-[500px] p-4 rounded-lg bg-background border-2 border-dashed border-textLighter transition-all duration-200"
            @dragover.prevent="onDragOver($event)" @drop="onDrop($event, column.value)" :class="{
              'border-primary border-solid': isDraggingOver && dragOverColumn === column.value
            }">
            <!-- Empty state -->
            <div v-if="itemsByStatus[column.value]?.length === 0"
              class="flex flex-col items-center justify-center h-full text-textLighter">
              <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No items in {{ column.label }}</p>
            </div>

            <!-- Items -->
            <TransitionGroup name="list" tag="div" class="flex flex-col gap-4">
              <div v-for="item in itemsByStatus[column.value]" :key="item.id"
                class="cursor-move card transform transition-transform duration-200 hover:scale-[1.02]" draggable="true"
                @dragstart="onDragStart($event, item)" @dragend="onDragEnd" :class="{
                  'opacity-50': draggedItem?.id === item.id,
                  'shadow-lg': draggedItem?.id === item.id
                }">
                <ResourceRenderer :resource="resource" :displayData="item" :layout="resource.layout"
                  :showHeading="false" />
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
    <TransitionRoot appear :show="showStats" as="template">
      <Dialog as="div" @close="showStats = false" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-cardLight p-6 shadow-xl transition-all">
                <div class="flex justify-between items-center mb-6">
                  <DialogTitle as="h3" class="text-xl font-semibold text-text">
                    {{ resource.label }} Statistics
                  </DialogTitle>
                  <button @click="showStats = false" class="text-gray-500 hover:text-gray-700">
                    <i class="pi pi-times text-xl"></i>
                  </button>
                </div>

                <!-- Metric Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div v-for="metric in metrics" :key="metric.label" class="card">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm text-text">{{ metric.label }}</p>
                        <p class="text-2xl font-bold text-text">{{ metric.value }}</p>
                      </div>
                      <span :class="[
                        'px-2 py-1 rounded-full text-xs',
                        metric.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ metric.trend > 0 ? '+' : '' }}{{ metric.trend }}%
                      </span>
                    </div>
                    <p class="text-sm text-text mt-2">vs last month</p>
                  </div>
                </div>

                <!-- Charts Grid -->
                <div class="grid grid-cols-2 gap-6">
                  <!-- Status Distribution (Pie Chart) -->
                  <div class="bg-cardLight rounded-lg p-4 shadow">
                    <h4 class="text-lg font-semibold mb-4">Status Distribution</h4>
                    <apexchart type="pie" height="300" :options="pieChartOptions" :series="pieChartSeries" />
                  </div>

                  <!-- Status Trends (Line Chart) -->
                  <div class="bg-cardLight rounded-lg p-4 shadow">
                    <h4 class="text-lg font-semibold mb-4">Status Trends</h4>
                    <apexchart type="line" height="300" :options="lineChartOptions" :series="lineChartSeries" />
                  </div>

                  <!-- Monthly Activity (Bar Chart) -->
                  <div class="bg-cardLight rounded-lg p-4 shadow col-span-2">
                    <h4 class="text-lg font-semibold mb-4">Monthly Activity</h4>
                    <apexchart type="bar" height="300" :options="barChartOptions" :series="barChartSeries" />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ResourceRenderer from '../../../Object/objectrenderer.vue'
import { effects } from '../../../../executables/effects'
import {
  Dialog,
  DialogOverlay,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import VueApexCharts from 'vue3-apexcharts'
import { format, subMonths, parseISO, isWithinInterval, sub } from 'date-fns'
const props = defineProps({
  resource: {
    type: Object,
    required: true
  },
  showAddButton: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const items = ref([])
const draggedItem = ref(null)
const loading = ref(false)
const isDraggingOver = ref(false)
const dragOverColumn = ref(null)
const showStats = ref(false)

// Metrics computation
const metrics = computed(() => {
  const total = items.value.length
  const lastMonth = subMonths(new Date(), 1)
  const thisMonth = new Date()

  const itemsThisMonth = items.value.filter(item =>
    isWithinInterval(parseISO(item.createdAt), { start: lastMonth, end: thisMonth })
  ).length

  const itemsLastMonth = items.value.filter(item =>
    isWithinInterval(parseISO(item.createdAt), {
      start: subMonths(lastMonth, 1),
      end: lastMonth
    })
  ).length

  const trend = itemsLastMonth ? ((itemsThisMonth - itemsLastMonth) / itemsLastMonth) * 100 : 100

  return [
    {
      label: 'Total Items',
      value: total,
      trend: trend.toFixed(1)
    },
    {
      label: 'Active Items',
      value: items.value.filter(item => item[statusField.value.name] !== 'completed').length,
      trend: trend.toFixed(1)
    },
    {
      label: 'Completed Items',
      value: items.value.filter(item => item[statusField.value.name] === 'completed').length,
      trend: trend.toFixed(1)
    },
    {
      label: 'Average Completion Time',
      value: '3.2 days',
      trend: -2.5
    }
  ]
})

// Pie Chart Data
const pieChartSeries = computed(() => {
  return columns.value.map(column =>
    itemsByStatus.value[column.value]?.length || 0
  )
})

const pieChartOptions = computed(() => ({
  labels: columns.value.map(column => column.label),
  colors: columns.value.map(column => column.color),
  chart: {
    type: 'pie'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}))

// Line Chart Data
const lineChartSeries = computed(() => {
  const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i))

  return columns.value.map(column => ({
    name: column.label,
    data: last6Months.map(month => {
      return items.value.filter(item =>
        item[statusField.value.name] === column.value &&
        isWithinInterval(parseISO(item.createdAt), {
          start: month,
          end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
        })
      ).length
    }).reverse()
  }))
})

const lineChartOptions = {
  chart: {
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  xaxis: {
    categories: Array.from({ length: 6 }, (_, i) =>
      format(subMonths(new Date(), 5 - i), 'MMM yyyy')
    )
  },
  stroke: {
    curve: 'smooth'
  }
}

// Bar Chart Data
const barChartSeries = computed(() => [{
  name: 'Created',
  data: Array.from({ length: 12 }, (_, i) => {
    const month = subMonths(new Date(), i)
    return items.value.filter(item =>
      isWithinInterval(parseISO(item.createdAt), {
        start: new Date(month.getFullYear(), month.getMonth(), 1),
        end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
      })
    ).length
  }).reverse()
}, {
  name: 'Completed',
  data: Array.from({ length: 12 }, (_, i) => {
    const month = subMonths(new Date(), i)
    return items.value.filter(item =>
      item[statusField.value.name] === 'completed' &&
      isWithinInterval(parseISO(item.updatedAt), {
        start: new Date(month.getFullYear(), month.getMonth(), 1),
        end: new Date(month.getFullYear(), month.getMonth() + 1, 0)
      })
    ).length
  }).reverse()
}])

const barChartOptions = {
  chart: {
    type: 'bar'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  xaxis: {
    categories: Array.from({ length: 12 }, (_, i) =>
      format(subMonths(new Date(), 11 - i), 'MMM yyyy')
    )
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  fill: {
    opacity: 1
  }
}

// Get status field from resource schema
const statusField = computed(() => {
  return props.resource.schema.find(field => field.type === 'status')
})

// Generate columns from status options
const columns = computed(() => {
  return statusField.value?.options || []
})

const itemsByStatus = computed(() => {
  const result = {}
  columns.value.forEach(column => {
    result[column.value] = items.value.filter(item =>
      item[statusField.value.name] === column.value
    )
  })
  return result
})

// Watch for resource changes
watch(() => props.resource, (newResource) => {
  items.value = [] // Clear current items
  fetchItems() // Fetch items for new resource
}, { deep: true })

const fetchItems = async () => {
  loading.value = true
  try {
    const response = await axios.get(`http://localhost:4500/api/v1/${props.resource.name}`)
    items.value = response.data.data
  } catch (error) {
    message.error(`Failed to fetch ${props.resource.label}`)
    console.error(error)
  } finally {
    loading.value = false
  }
}

const navigateToAdd = () => {
  router.push(`/dashboard/${props.resource.path}/item/add`)
}

const onDragStart = (event, item) => {
  draggedItem.value = item
  event.dataTransfer.effectAllowed = 'move'
  // Add some custom styling to dragged element
  event.target.classList.add('dragging')
}

const onDragEnd = (event) => {
  event.target.classList.remove('dragging')
  draggedItem.value = null
  isDraggingOver.value = false
  dragOverColumn.value = null
}

const onDragOver = (event) => {
  event.preventDefault()
  isDraggingOver.value = true
  dragOverColumn.value = event.currentTarget.dataset.column
  event.dataTransfer.dropEffect = 'move'
}

const onDrop = async (event, newStatus) => {
  event.preventDefault()
  isDraggingOver.value = false
  dragOverColumn.value = null

  if (!draggedItem.value) return

  const item = draggedItem.value
  const originalStatus = item[statusField.value.name]
  if (originalStatus === newStatus) return

  const itemIndex = items.value.findIndex(t => t.id === item.id)
  items.value[itemIndex] = {
    ...item,
    [statusField.value.name]: newStatus
  }

  try {
    await axios.put(
      `http://localhost:4500/api/v1/${props.resource.name}/${item.id}`,
      { [statusField.value.name]: newStatus }
    )

    console.log('Email payload:', item);

    const payload = {
      Logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Amazon_logo.svg/800px-Amazon_logo.svg.png",
      subject: "Status Update",
      recipientEmail: item.email,
      message: `Your  ${props.resource.label.slice(0, -1)} has been updated to ${newStatus}.`,
    }

    await effects.sendEmail(payload)
    message.success(`${props.resource.label.slice(0, -1)} moved to ${newStatus}`)







  } catch (error) {
    items.value[itemIndex] = { ...item, [statusField.value.name]: originalStatus }
    message.error(`Failed to update ${props.resource.label.slice(0, -1)} status`)
    console.error(error)
  } finally {
    draggedItem.value = null
  }
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
/* Transition animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>