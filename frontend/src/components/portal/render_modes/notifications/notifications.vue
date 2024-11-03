<template>
  <div class="timeline-container">
    <tabs>
      <tab name="All" :selected="true">
        <div v-if="filteredNotifications.length" class="timeline">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="timeline-item"
            :class="{ unread: !notification.read }"
          >
            <div class="timeline-icon">
              <i class="pi pi-bell"></i>
            </div>
            <div class="timeline-content">
              <div class="flex justify-between">
                <h3 class="timeline-title">{{ notification.title }}</h3>
                <action_dispatcher :resource="{
                    actions:[
                      {
                        name:'ArchiveAction',
                        icon:'fa fa-archive',
                        label:'Archive'
                      },
                      {
                        name: 'FavoriteAction',
                        icon: 'pi pi-star',
                        label: 'Favorite',
                      }
                    ]
                  }" :item="{}"  />
              </div>
              <p class="timeline-body">{{ notification.body }}</p>
              <span class="timeline-date">{{ formatTimeAgo(notification.createdAt) }}</span>
            </div>
          </div>
        </div>
        <a-empty v-else description="No notifications available" />
      </tab>
      
      <tab name="Unread">
        <div v-if="unreadNotifications.length" class="timeline">
          <div
            v-for="notification in unreadNotifications"
            :key="notification.id"
            class="timeline-item unread"
          >
            <div class="timeline-icon">
              <i class="pi pi-bell"></i>
            </div>
            <div class="timeline-content">
              <div class="flex justify-between">
                <h3 class="timeline-title">{{ notification.title }}</h3>
                <action_dispatcher :resource="{
                    actions:[
                      {
                        name:'ArchiveAction',
                        icon:'fa fa-archive',
                        label:'Archive'
                      },
                      {
                        name: 'FavoriteAction',
                        icon: 'pi pi-star',
                        label: 'Favorite',
                      }
                    ]
                  }" :item="{}"  />
              </div>
              <p class="timeline-body">{{ notification.body }}</p>
              <span class="timeline-date">{{ formatTimeAgo(notification.createdAt) }}</span>
            </div>
          </div>
        </div>
        <a-empty v-else description="No unread notifications" />
      </tab>
      
      <tab name="Read">
        <div v-if="readNotifications.length" class="timeline">
          <div
            v-for="notification in readNotifications"
            :key="notification.id"
            class="timeline-item"
          >
            <div class="timeline-icon">
              <i class="pi pi-bell"></i>
            </div>
            <div class="timeline-content">
              <div class="flex justify-between">
                <h3 class="timeline-title">{{ notification.title }}</h3>
                <action_dispatcher :resource="{
                    actions:[
                      {
                        name:'ArchiveAction',
                        icon:'fa fa-archive',
                        label:'Archive'
                      },
                      {
                        name: 'FavoriteAction',
                        icon: 'pi pi-star',
                        label: 'Favorite',
                      }
                    ]
                  }" :item="{}"  />
              </div>
              <p class="timeline-body">{{ notification.body }}</p>
              <span class="timeline-date">{{ formatTimeAgo(notification.createdAt) }}</span>
            </div>
          </div>
        </div>
        <a-empty v-else description="No read notifications" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import axios from 'axios';
import { Empty } from 'ant-design-vue';
import action_dispatcher from '../../../action_dispatcher.vue';
import { Tabs, Tab } from 'vue3-tabs-component';

export default {
  components: {
    'a-empty': Empty,
    action_dispatcher,
    Tabs,
    Tab,
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
    unreadNotifications() {
      return this.filteredNotifications.filter(
        (notification) => !notification.read
      );
    },
    readNotifications() {
      return this.filteredNotifications.filter(
        (notification) => notification.read
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
    formatTimeAgo(dateStr) {
      const now = new Date();
      const date = new Date(dateStr);
      const diffInSeconds = Math.floor((now - date) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);

      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
      } else if (diffInMonths < 6) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    },
  },
  mounted() {
    this.fetchNotifications();
  },
};
</script>

<style scoped>
.timeline-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50px;
  width: 2px;
  background: #ccc;
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
}

.timeline-icon {
  position: absolute;
  left: 35px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.timeline-content {
  margin-left: 80px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.timeline-item.unread .timeline-content {
  background: #e6f7ff;
}

.timeline-title {
  margin-top: 0;
  color: #333;
}

.timeline-body {
  margin: 10px 0;
}

.timeline-date {
  font-size: 0.8rem;
  color: #888;
}

::v-deep .tabs-component {
  margin-bottom: 20px;
}

::v-deep .tabs-component-tabs {
  border-bottom: solid 1px #ddd;
  margin-bottom: 20px;
}

::v-deep .tabs-component-tab {
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-right: 30px;
  list-style: none;
  padding: 10px 0;
  display: inline-block;
  cursor: pointer;
}

::v-deep .tabs-component-tab.is-active {
  color: #000;
  border-bottom: solid 2px #000;
}

::v-deep .tabs-component-panels {
  padding: 20px 0;
}
</style>