<template>
    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="previousPeriod" class="btn-nav">
          <i class="ph-caret-left"></i>
        </button>
        <h2 class="header-title">{{ currentPeriodLabel }}</h2>
        <button @click="nextPeriod" class="btn-nav">
          <i class="ph-caret-right"></i>
        </button>
        <select v-model="currentView" class="select-view">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <button @click="showAddEventForm" class="btn-add">
          <i class="ph-plus"></i> Add Event
        </button>
      </div>
  
      <div class="calendar-body" :class="currentView" @drop="onDrop" @dragover.prevent>
        <!-- Day View -->
        <template v-if="currentView === 'day'">
          <div class="day-grid">
            <div v-for="hour in 24" :key="hour" class="hour-slot">
              <div class="hour-label">{{ formatHour(hour - 1) }}</div>
              <div class="event-container">
                <div v-for="event in getEventsForHour(hour - 1)" 
                     :key="event.id"
                     class="event"
                     :class="event.category"
                     :style="{ height: `${event.duration * 60}px` }"
                     draggable="true"
                     @dragstart="onDragStart($event, event)"
                     @click="showEventDetails(event)">
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </template>
  
        <!-- Week View -->
        <template v-else-if="currentView === 'week'">
          <div class="week-grid">
            <div class="weekdays">
              <div v-for="day in 7" :key="day" class="weekday-label">
                {{ getDayName(day) }}
              </div>
            </div>
            <div v-for="hour in 24" :key="hour" class="week-row">
              <div class="hour-label">{{ formatHour(hour - 1) }}</div>
              <div v-for="day in 7" :key="day" class="day-column">
                <div class="event-container">
                  <div v-for="event in getEventsForHourAndDay(hour - 1, day)" 
                       :key="event.id"
                       class="event"
                       :class="event.category"
                       :style="{ height: `${event.duration * 60}px` }"
                       draggable="true"
                       @dragstart="onDragStart($event, event)"
                       @click="showEventDetails(event)">
                    {{ event.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
  
        <!-- Month View -->
        <template v-else-if="currentView === 'month'">
          <div class="month-grid">
            <div v-for="week in 6" :key="week" class="week-row">
              <div v-for="day in 7" :key="day" class="day-cell"
                   @drop="onDrop($event, getDateForCell(week, day))"
                   @dragover.prevent>
                <div class="day-number">{{ getDayLabel(week, day) }}</div>
                <div v-for="event in getEventsForDay(week, day)" 
                     :key="event.id"
                     class="event"
                     :class="event.category"
                     draggable="true"
                     @dragstart="onDragStart($event, event)"
                     @click="showEventDetails(event)">
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </template>
  
        <!-- Year View -->
        <template v-else-if="currentView === 'year'">
          <div class="year-grid">
            <div v-for="month in 12" :key="month" class="month-cell">
              <h3 class="month-name">{{ getMonthName(month - 1) }}</h3>
              <div v-for="event in getEventsForMonth(month - 1)" 
                   :key="event.id"
                   class="event"
                   :class="event.category"
                   @click="showEventDetails(event)">
                {{ event.title }}
              </div>
            </div>
          </div>
        </template>
      </div>
  
      <!-- Event Modal -->
      <div v-if="selectedEvent" class="event-modal">
        <h3 class="modal-title">{{ selectedEvent.title }}</h3>
        <p class="modal-description">{{ selectedEvent.description }}</p>
        <p class="modal-date"><i class="ph-calendar"></i> Start: {{ formatDate(selectedEvent.start) }}</p>
        <p class="modal-date"><i class="ph-calendar"></i> End: {{ formatDate(selectedEvent.end) }}</p>
        <a v-if="selectedEvent.link" :href="selectedEvent.link" target="_blank" class="event-link">
          <i class="ph-link"></i> More Info
        </a>
        <div class="modal-actions">
          <button @click="editEvent(selectedEvent)" class="btn-edit">
            <i class="ph-pencil"></i> Edit
          </button>
          <button @click="deleteEvent(selectedEvent)" class="btn-delete">
            <i class="ph-trash"></i> Delete
          </button>
          <button @click="closeEventModal" class="btn-close">
            <i class="ph-x"></i> Close
          </button>
        </div>
      </div>
  
      <!-- Add Event Modal -->
      <div v-if="showAddForm" class="add-event-modal">
        <h3 class="modal-title">Add New Event</h3>
        <form @submit.prevent="addEvent">
          <input v-model="newEvent.title" placeholder="Event Title" required class="input-field">
          <textarea v-model="newEvent.description" placeholder="Event Description" class="input-field"></textarea>
          <input v-model="newEvent.start" type="datetime-local" required class="input-field">
          <input v-model="newEvent.end" type="datetime-local" required class="input-field">
          <select v-model="newEvent.category" required class="input-field">
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="deadline">Deadline</option>
            <option value="timeline">Timeline</option>
          </select>
          <div class="modal-actions">
            <button type="submit" class="btn-save">Save</button>
            <button @click="closeAddEventForm" class="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>



<script

  
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import dayjs from 'dayjs';
  
  export default {
    name: 'CalendarComponent',
    props: {
      initialView: {
        type: String,
        default: 'month'
      }
    },
    setup(props) {
      const currentDate = ref(new Date());
      const currentView = ref(props.initialView);
      const selectedEvent = ref(null);
      const allEvents = ref([]);
      const showAddForm = ref(false);
      const newEvent = ref({
        title: '',
        description: '',
        start: '',
        end: '',
        category: 'work'
      });
  
      const currentPeriodLabel = computed(() => {
        switch (currentView.value) {
          case 'day':
            return dayjs(currentDate.value).format('MMMM D, YYYY');
          case 'week':
            return `Week of ${dayjs(currentDate.value).startOf('week').format('MMMM D, YYYY')}`;
          case 'month':
            return dayjs(currentDate.value).format('MMMM YYYY');
          case 'year':
            return dayjs(currentDate.value).format('YYYY');
        }
      });
  
      const loadEvents = () => {
        const storedEvents = localStorage.getItem('calendarEvents');
        if (storedEvents) {
          allEvents.value = JSON.parse(storedEvents);
        }
      };
  
      const saveEvents = () => {
        localStorage.setItem('calendarEvents', JSON.stringify(allEvents.value));
      };
  
      onMounted(loadEvents);
  
      watch(allEvents, saveEvents, { deep: true });
  
      const previousPeriod = () => {
        currentDate.value = dayjs(currentDate.value).subtract(1, currentView.value).toDate();
      };
  
      const nextPeriod = () => {
        currentDate.value = dayjs(currentDate.value).add(1, currentView.value).toDate();
      };
  
      const getEventsForHour = (hour) => {
        return allEvents.value.filter(event => 
          dayjs(event.start).hour() === hour && 
          dayjs(event.start).isSame(currentDate.value, 'day')
        );
      };
  
      const getEventsForHourAndDay = (hour, day) => {
        const date = dayjs(currentDate.value).startOf('week').add(day - 1, 'day');
        return allEvents.value.filter(event => 
          dayjs(event.start).hour() === hour && 
          dayjs(event.start).isSame(date, 'day')
        );
      };
  
      const getEventsForDay = (week, day) => {
        const date = getDateForCell(week, day);
        return allEvents.value.filter(event => 
          dayjs(event.start).isSame(date, 'day')
        );
      };
  
      const getEventsForMonth = (month) => {
        return allEvents.value.filter(event => 
          dayjs(event.start).month() === month &&
          dayjs(event.start).year() === dayjs(currentDate.value).year()
        );
      };
  
      const getDateForCell = (week, day) => {
        return dayjs(currentDate.value)
          .startOf('month')
          .startOf('week')
          .add(week, 'week')
          .add(day, 'day')
          .toDate();
      };
  
      const getDayLabel = (week, day) => {
        return dayjs(getDateForCell(week, day)).date();
      };
  
      const getMonthName = (month) => {
        return dayjs().month(month).format('MMMM');
      };
  
      const getDayName = (day) => {
        return dayjs().day(day - 1).format('ddd');
      };
  
      const formatHour = (hour) => {
        return dayjs().hour(hour).minute(0).format('HH:mm');
      };
  
      const showEventDetails = (event) => {
        selectedEvent.value = event;
      };
  
      const closeEventModal = () => {
        selectedEvent.value = null;
      };
  
      const editEvent = (event) => {
        // Implement edit functionality
        console.log('Edit event:', event);
      };
  
      const deleteEvent = (event) => {
        allEvents.value = allEvents.value.filter(e => e.id !== event.id);
        closeEventModal();
      };
  
      const showAddEventForm = () => {
        showAddForm.value = true;
      };
  
      const closeAddEventForm = () => {
        showAddForm.value = false;
        newEvent.value = {
          title: '',
          description: '',
          start: '',
          end: '',
          category: 'work'
        };
      };
  
      const addEvent = () => {
        const event = {
          ...newEvent.value,
          id: Date.now(),
          start: new Date(newEvent.value.start),
          end: new Date(newEvent.value.end),
          duration: (new Date(newEvent.value.end) - new Date(newEvent.value.start)) / (1000 * 60 * 60)
        };
        allEvents.value.push(event);
        closeAddEventForm();
      };
  
      const onDragStart = (event, calendarEvent) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(calendarEvent));
      };
  
      const onDrop = (event, date) => {
        const droppedEvent = JSON.parse(event.dataTransfer.getData('text/plain'));
        const updatedEvent = {
          ...droppedEvent,
          start: dayjs(date).hour(dayjs(droppedEvent.start).hour()).minute(dayjs(droppedEvent.start).minute()).toDate(),
          end: dayjs(date).hour(dayjs(droppedEvent.end).hour()).minute(dayjs(droppedEvent.end).minute()).toDate()
        };
        const index = allEvents.value.findIndex(e => e.id === droppedEvent.id);
        if (index !== -1) {
          allEvents.value[index] = updatedEvent;
        }
      };
  
      const formatDate = (date) => {
        return dayjs(date).format('MMMM D, YYYY HH:mm');
      };
  
      return {
        currentDate,
        currentView,
        selectedEvent,
        showAddForm,
        newEvent,
        currentPeriodLabel,
        previousPeriod,
        nextPeriod,
        getEventsForHour,
        getEventsForHourAndDay,
        getEventsForDay,
        getEventsForMonth,
        getDateForCell,
        getDayLabel,
        getMonthName,
        getDayName,
        formatHour,
        showEventDetails,
        closeEventModal,
        editEvent,
        deleteEvent,
        showAddEventForm,
        closeAddEventForm,
        addEvent,
        onDragStart,
        onDrop,
        formatDate
      };
    }
  };
  </script>
  


  