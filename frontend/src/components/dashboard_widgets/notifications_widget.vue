<template>
    <div class="notifications-widget">
      <ul class="notifications-list">
        <li 
          v-for="(notification, index) in notifications" 
          :key="index"
          class="notification-item"
          :class="notification.type"
        >
          <div class="notification-icon">
            <i :class="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <small>{{ formatDate(notification.timestamp) }}</small>
          </div>
          <button @click="dismissNotification(index)" class="dismiss-btn">×</button>
        </li>
      </ul>
      <button v-if="widgetProps.showAllButton" @click="showAllNotifications" class="show-all-btn">
        Show All Notifications
      </button>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  
  export default defineComponent({
    name: 'NotificationsWidget',
    props: {
      widgetProps: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const notifications = ref(props.widgetProps.notifications || [])
  
      const getIconClass = (type) => {
        const icons = {
          info: 'fas fa-info-circle',
          success: 'fas fa-check-circle',
          warning: 'fas fa-exclamation-triangle',
          error: 'fas fa-times-circle'
        }
        return icons[type] || icons.info
      }
  
      const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString()
      }
  
      const dismissNotification = (index) => {
        notifications.value.splice(index, 1)
      }
  
      const showAllNotifications = () => {
        // Implement logic to show all notifications
        console.log('Show all notifications')
      }
  
      return {
        notifications,
        getIconClass,
        formatDate,
        dismissNotification,
        showAllNotifications
      }
    }
  })
  </script>
  
  <style scoped>
  .notifications-list {
    list-style-type: none;
    padding: 0;
  }
  
  .notification-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-icon {
    margin-right: 10px;
  }
  
  .notification-content {
    flex-grow: 1;
  }
  
  .dismiss-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .show-all-btn {
    margin-top: 10px;
  }
  </style>