<template>
    <a-dropdown class="notification-dropdown" trigger="click" @visibleChange="onDropdownVisibleChange">
      <a class="notification-bell">
        <i class="pi pi-bell text-text"></i>
        <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
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
  import { mapGetters } from 'vuex';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { getMessaging, onMessage } from "firebase/messaging";
  
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
        unreadCount: 0,
        lastNotificationTimestamp: localStorage.getItem('lastNotificationTimestamp') || 0,
        messaging: null,
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
          this.updateUnreadCount();
          this.showNewNotifications();
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      },
      updateUnreadCount() {
        const lastReadTimestamp = localStorage.getItem('lastReadTimestamp') || 0;
        this.unreadCount = this.filteredNotifications.filter(
          notification => new Date(notification.createdAt) > new Date(parseInt(lastReadTimestamp))
        ).length;
        localStorage.setItem('unreadCount', this.unreadCount);
      },
      async markAsRead() {
        const lastReadTimestamp = Date.now();
        localStorage.setItem('lastReadTimestamp', lastReadTimestamp);
        
        // Update the read status on the server
        const unreadNotifications = this.filteredNotifications.filter(
          notification => new Date(notification.createdAt) > new Date(parseInt(localStorage.getItem('lastReadTimestamp') || '0'))
        );
        
        for (const notification of unreadNotifications) {
          try {
            await axios.patch(`${import.meta.env.VITE_APP_API_URL}/api/v1/notifications/${notification.id}`, {
              read: true
            });
          } catch (error) {
            console.error('Error marking notification as read:', error);
          }
        }
  
        this.updateUnreadCount();
      },
  
      onDropdownVisibleChange(visible) {
        if (visible) {
          this.markAsRead();
        }
      },
      
      showNewNotifications() {
        const newNotifications = this.filteredNotifications.filter(
          notification => new Date(notification.createdAt) > new Date(parseInt(this.lastNotificationTimestamp))
        );
  
        newNotifications.forEach(notification => {
          // Only show toast for notifications that haven't been shown yet
          if (new Date(notification.createdAt) > new Date(parseInt(localStorage.getItem('lastToastTimestamp') || '0'))) {
            toast.info(
              `${notification.title}\n${notification.body}`,
              {
                autoClose: 5000,
                position: toast.POSITION.BOTTOM_RIGHT,
              }
            );
          }
        });
  
        if (newNotifications.length > 0) {
          const latestTimestamp = Math.max(...newNotifications.map(n => new Date(n.createdAt).getTime()));
          localStorage.setItem('lastNotificationTimestamp', latestTimestamp);
          localStorage.setItem('lastToastTimestamp', latestTimestamp);
          this.lastNotificationTimestamp = latestTimestamp;
        }
      },
      
      setupPushNotificationListener() {
        this.messaging = getMessaging();
        onMessage(this.messaging, (payload) => {
          console.log('Message received. ', payload);
          this.handleIncomingNotification(payload);
        });
      },
  
      handleIncomingNotification(payload) {
        // Add the new notification to the list
        const newNotification = {
          id: Date.now(), // Use a temporary ID
          title: payload.notification.title,
          body: payload.notification.body,
          createdAt: new Date().toISOString(),
          recipient: this.userId,
          read: false
        };
        this.notifications.unshift(newNotification);
  
        // Update the unread count
        this.unreadCount += 1;
        localStorage.setItem('unreadCount', this.unreadCount);
  
        // Show toast notification
        toast.info(
          `${newNotification.title}\n${newNotification.body}`,
          {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
  
        // Update last notification timestamp
        const newTimestamp = Date.now();
        localStorage.setItem('lastNotificationTimestamp', newTimestamp);
        this.lastNotificationTimestamp = newTimestamp;
      },
    },
    mounted() {
      this.fetchNotifications();
      this.unreadCount = parseInt(localStorage.getItem('unreadCount') || '0');
      this.setupPushNotificationListener(); // Add this line
    },
    watch: {
      filteredNotifications: {
        handler() {
          this.updateUnreadCount();
        },
        deep: true,
      },
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
    position: relative;
  }
  
  .notification-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff4d4f;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .notification-list {
      width: 40vh; /* Set a maximum width for the dropdown */
      padding: 1rem;
      font-family: Arial, sans-serif;
      background-color: var(--cardLight);
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
  