<template>
    <div class="table-widget">
      <div class="table-container">
        <table :class="tableClass">
          <thead>
            <tr>
              <th 
                v-for="(header, index) in widgetProps.headers" 
                :key="index"
                @click="sortTable(header.key)"
                :class="{ sortable: header.sortable }"
              >
                {{ header.label }}
                <span v-if="header.sortable" class="sort-icon">
                  {{ getSortIcon(header.key) }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
              <td v-for="(header, cellIndex) in widgetProps.headers" :key="cellIndex">
                {{ row[header.key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="widgetProps.pagination" class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </template>
  
  <script>
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'TableWidget',
  props: {
    widgetProps: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const currentPage = ref(1)
    const sortKey = ref('')
    const sortOrder = ref('asc')

    const tableClass = computed(() => {
      return props.widgetProps.tableClass || 'default-table'
    })

    const itemsPerPage = computed(() => props.widgetProps.itemsPerPage || 10)

    const sortedData = computed(() => {
      let data = [...props.widgetProps.data]
      if (sortKey.value) {
        data.sort((a, b) => {
          let modifier = sortOrder.value === 'asc' ? 1 : -1
          if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier
          if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier
          return 0
        })
      }
      return data
    })

    const totalPages = computed(() => 
      Math.ceil(sortedData.value.length / itemsPerPage.value)
    )

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return sortedData.value.slice(start, end)
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const sortTable = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const getSortIcon = (key) => {
      if (sortKey.value !== key) return '⇅'
      return sortOrder.value === 'asc' ? '▲' : '▼'
    }

    return {
      currentPage,
      totalPages,
      paginatedData,
      nextPage,
      prevPage,
      sortTable,
      getSortIcon,
      tableClass
    }
  }
})
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}

.default-table {
  width: 100%;
  border-collapse: collapse;
}

.default-table th, .default-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.default-table th {
  background-color: #f2f2f2;
}

.sortable {
  cursor: pointer;
}

.sort-icon {
  margin-left: 5px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
}
</style>