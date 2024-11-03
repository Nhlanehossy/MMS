<template>
  <div class="list-widget">
    <div :class="widgetProps.listClass">
      <ResourceRenderer
        v-for="(item, index) in paginatedItems"
        :key="index"
        :resource="getItemResource()"
        :displayData="getItemDisplayData(item)"
        :layout="widgetProps.itemLayout || defaultItemLayout"
        :showHeading="false"
        :class="widgetProps.itemClass"
      />
    </div>
    <div v-if="widgetProps.pagination" class="pagination">
      <a-pagination
        :current="currentPage"
        :total="widgetProps.items.length"
        :page-size="itemsPerPage"
        @change="changePage"
        show-total
        :show-size-changer="false"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { Pagination } from 'ant-design-vue'
import objectrenderer from '../Object/objectrenderer.vue';

export default defineComponent({
  name: 'ListWidget',
  components: {
    ResourceRenderer:objectrenderer,
    'a-pagination': Pagination
  },
  props: {
    widgetProps: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const currentPage = ref(1)
    const itemsPerPage = props.widgetProps.itemsPerPage || 10
    const totalPages = computed(() =>
      Math.ceil(props.widgetProps.items.length / itemsPerPage)
    )
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return props.widgetProps.items.slice(start, end)
    })
    const changePage = (page) => {
      currentPage.value = page
    }

    const defaultItemLayout = {
      rows: 1,
      columns: 3,
      fields: {
        avatar: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'middle-center' },
        title: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'middle-left' },
        description: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1, alignment: 'middle-left' },
      }
    }

    const getItemResource = () => {
      return {
        name: 'listItem',
        schema: [
          { name: 'avatar', type: 'image' },
          { name: 'title', type: 'text' },
          { name: 'description', type: 'text' },
          { name: 'subtitle', type: 'text' },
          { name: 'tags', type: 'array' },
          { name: 'date', type: 'date' },
          { name: 'status', type: 'enum', options: ['active', 'inactive', 'pending'] },
          { name: 'progress', type: 'number', min: 0, max: 100 },
          { name: 'link', type: 'url' },
        ]
      }
    }

    const getItemDisplayData = (item) => {
      if (typeof item === 'object') {
        return {
          avatar: item.avatar || '',
          title: item.title || '',
          description: item.description || '',
          subtitle: item.subtitle || '',
          tags: item.tags || [],
          date: item.date || null,
          status: item.status || '',
          progress: item.progress || 0,
          link: item.link || '',
        }
      } else {
        return {
          title: String(item),
          description: '',
        }
      }
    }

    return {
      currentPage,
      totalPages,
      paginatedItems,
      changePage,
      defaultItemLayout,
      getItemResource,
      getItemDisplayData,
    }
  }
})
</script>

<style scoped>
.list-widget {
  padding: 16px;
  background-color: var(--cardLight);
}
.pagination {
  margin-top: 16px;
  text-align: center;
}
</style>