<template>
    <div class="calendar-widget">
      <v-calendar
        :attributes="calendarAttributes"
        :theme="widgetProps.theme"
        :is-expanded="widgetProps.isExpanded"
        :columns="widgetProps.columns"
      />
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import VCalendar from 'v-calendar'
  
  export default defineComponent({
    name: 'CalendarWidget',
    components: {
      VCalendar
    },
    props: {
      widgetProps: {
        type: Object,
        required: true
      }
    },
    computed: {
      calendarAttributes() {
        return this.widgetProps.events.map(event => ({
          key: event.id,
          dates: event.date,
          dot: event.dot || { color: 'blue' },
          popover: {
            label: event.label
          }
        }))
      }
    }
  })
  </script>