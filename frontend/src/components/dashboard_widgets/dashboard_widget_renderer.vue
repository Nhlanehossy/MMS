<template>
    <WidgetWrapper :title="title" @see-more="onSeeMoreClick">
      <component 
        :is="widgetComponent" 
        :widgetProps="widgetProps"
      />
    </WidgetWrapper>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue'
  import Calendar_widget from './calendar_widget.vue'
  import Chart_widget from './chart_widget.vue'
  import List_widget from './list_widget.vue'
  import Metric_cards_widget from './metric_cards_widget.vue'
  import Notifications_widget from './notifications_widget.vue'
  import Statistic_widget from './statistic_widget.vue'
  import Table_widget from './table_widget.vue'
  import WidgetWrapper from './widget_wrapper.vue'
  
  export default defineComponent({
    name: 'DashboardWidget',
    components: {
      WidgetWrapper,
      Calendar_widget,
      Chart_widget,
      List_widget,
      Metric_cards_widget,
      Notifications_widget,
      Statistic_widget,
      Table_widget
    },
    props: {
      title: {
        type: String,
        required: true,
      },
      widgetType: {
        type: String,
        required: true,
        validator: (value) => {
          return [
            'metric-card',
            'chart',
            'statistic',
            'list',
            'table',
            'calendar',
            'notifications',
          ].includes(value)
        },
      },
      widgetProps: {
        type: Object,
        required: true
      },
    },
    setup(props) {
      const widgetComponent = computed(() => {
        const componentMap = {
          'metric-card': 'Metric_cards_widget',
          'chart': 'Chart_widget',
          'statistic': 'Statistic_widget',
          'list': 'List_widget',
          'table': 'Table_widget',
          'calendar': 'Calendar_widget',
          'notifications': 'Notifications_widget'
        }
        return componentMap[props.widgetType]
      })
  
      const onSeeMoreClick = () => {
        console.log(`See more clicked for ${props.title}`)
        // Implement any additional logic for "see more" action
      }
  
      return {
        widgetComponent,
        onSeeMoreClick
      }
    }
  })
  </script>