<template>
    <GridLayout :rows="6" :columns="5" :layout="gridLayout">
      <template v-for="item in gridLayout" :key="item.name" v-slot:[item.name]>
        <DashboardWidget :title="item.title" :widgetType="item.widgetType" :widgetProps="item.widgetProps" />
      </template>
    </GridLayout>
  </template>
  
  <script>
  import GridLayout from '@/components/GridLayout.vue';
  import dashboard_widget_renderer from '@/components/dashboard_widgets/dashboard_widget_renderer.vue';
  export default {
    components: {
      GridLayout,
      DashboardWidget: dashboard_widget_renderer,
    },
    data() {
      return {
        gridLayout: [
          {
            name: 'item1',
            rowStart: 1,
            rowSpan: 2,
            colStart: 1,
            colSpan: 5,
            title: 'Key Metrics',
            widgetType: 'metric-card',
            widgetProps: {
              metrics: [
                { label: 'Total Revenue', value: '$1,234,567', icon: 'fas fa-dollar-sign', color: '#28a745' },
                { label: 'New Customers', value: '1,234', icon: 'fas fa-users', color: '#17a2b8' },
                { label: 'Orders', value: '5,678', icon: 'fas fa-shopping-cart', color: '#ffc107' },
                { label: 'Conversion Rate', value: '2.34%', icon: 'fas fa-chart-line', color: '#dc3545', change: 0.5 },
                { label: 'Average Order Value', value: '$217', icon: 'fas fa-tags', color: '#6c757d' },
                { label: 'Customer Satisfaction', value: '4.8/5', icon: 'fas fa-smile', color: '#20c997' }
              ],
              columns: 2,
              gap: '1rem',
              cardBackground: '#f8f9fa'
            }
          },
          {
            name: 'item2',
            rowStart: 3,
            rowSpan: 2,
            colStart: 1,
            colSpan: 3,
            title: 'Sales Trend',
            widgetType: 'chart',
            widgetProps: {
              chartType: 'line',
              height: 250,
              series: [{
                name: 'Sales',
                data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
              }],
              xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
              },
              yaxis: {
                title: {
                  text: 'Sales Amount ($)'
                }
              },
              theme: {
                mode: 'light',
                palette: 'palette1'
              },
              additionalOptions: {
                stroke: {
                  curve: 'smooth'
                },
                markers: {
                  size: 5
                }
              }
            }
          },
          {
            name: 'item3',
            rowStart: 3,
            rowSpan: 2,
            colStart: 4,
            colSpan: 2,
            title: 'Recent Activities',
            widgetType: 'list',
            widgetProps: {
              items: [
                { title: 'New order received', description: 'Order #12345 from John Doe' },
                { title: 'Payment processed', description: 'Payment of $500 for Order #12344' },
                { title: 'New customer registered', description: 'Jane Smith created an account' },
                { title: 'Product restocked', description: 'Item XYZ is now back in stock' }
              ],
              listClass: 'activity-list',
              itemClass: 'activity-item',
              pagination: false,
              itemsPerPage: 4
            }
          },
          {
            name: 'item4',
            rowStart: 5,
            rowSpan: 2,
            colStart: 1,
            colSpan: 5,
            title: 'Top Selling Products',
            widgetType: 'table',
            widgetProps: {
              headers: [
                { key: 'id', label: 'ID', sortable: true },
                { key: 'name', label: 'Product Name', sortable: true },
                { key: 'sales', label: 'Sales', sortable: true },
                { key: 'revenue', label: 'Revenue', sortable: true }
              ],
              data: [
                { id: 1, name: 'Product A', sales: 1234, revenue: '$12,340' },
                { id: 2, name: 'Product B', sales: 987, revenue: '$9,870' },
                { id: 3, name: 'Product C', sales: 765, revenue: '$7,650' },
                { id: 4, name: 'Product D', sales: 543, revenue: '$5,430' },
                { id: 5, name: 'Product E', sales: 321, revenue: '$3,210' }
              ],
              pagination: false,
              itemsPerPage: 5,
              tableClass: 'product-table'
            }
          },
        ]
      };
    },
  };
  </script>