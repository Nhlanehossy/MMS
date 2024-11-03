<template>
    <a-dropdown class="notification-dropdown" trigger="click">
      <a class="notification-bell">
        <i class="pi pi-bell"></i>
      </a>
      <template #overlay>
        <div class="notification-list">
          <div v-if="filteredNotifications.length">
            <a-list item-layout="horizontal">
              <a-list-item
                v-for="(notification, index) in filteredNotifications.slice(0, 3)"
                :key="notification.id"
                :class="{'unread': !notification.read}"
              >
                <a-list-item-meta>
                  <template #title>
                    <span class="notification-title">
                      <i class="pi pi-bell"></i> {{ notification.title }}
                    </span>
                  </template>
                  <template #description>
                    <div>
                      <p>{{ notification.body }}</p>
                      <span class="notification-date">{{ formatDate(notification.createdAt) }}</span>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <router-link class="see-all" to="/dashboard/notifications">See All</router-link>
          </div>
          <a-empty v-else description="No notifications available" />
        </div>
      </template>
    </a-dropdown>
  </template>
  
  <script>
  import axios from 'axios';
  import { Empty, List } from 'ant-design-vue';
  import { mapGetters } from 'vuex'; // If you use Vuex to manage state
  
  export default {
    components: {
      'a-empty': Empty,
      'a-list': List,
      'a-list-item': List.Item,
      'a-list-item-meta': List.Item.Meta,
    },
    data() {
      return {
        notifications: [],
        userId: localStorage.getItem('userId') || null,
      };
    },
    computed: {
      filteredNotifications() {
        return this.notifications.filter(
          (notification) => notification.recipient === this.userId
        );
      },
    },
    methods: {
      async fetchNotifications() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/notifications`);
          this.notifications = response.data.data;
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      },
    },
    mounted() {
      this.fetchNotifications();
    },
  };
  </script>
  
  <style scoped>
  .notification-dropdown {
    position: relative;
  }
  
  .notification-bell {
    font-size: 1.2rem;
    cursor: pointer;
    color: #fff;
  }
  
  .notification-list {
      width: 40vh; /* Set a maximum width for the dropdown */
      padding: 1rem;
      font-family: Arial, sans-serif;
      background-color: white;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px; /* Added border radius for a softer look */
  }
  
  .unread .notification-title {
    font-weight: bold;
  }
  
  .notification-title {
    display: flex;
    align-items: center;
  }
  
  .notification-title i {
    margin-right: 0.5rem;
  }
  
  .notification-date {
    font-size: 0.8rem;
    color: #888;
  }
  
  .see-all {
    display: block;
    margin-top: 1rem; /* Add some space above the link */
    text-align: center;
    color: #1890ff; /* Ant Design primary color */
    text-decoration: underline; /* Underline for better visibility */
  }
  
  .see-all:hover {
    color: #40a9ff; /* Darker shade on hover */
  }
  </style>
  