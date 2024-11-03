<script>
import { RouterView } from 'vue-router';
import { getFilteredResources } from './executables/accessControl';
import Loader from "./components/u_i/sf_loader_alt.vue";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import axios from 'axios';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import GenericModal from "./components/modal.vue";
import { ConfigProvider } from 'ant-design-vue';
import { useThemeManager } from './executables/themeManager';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCDUZNzlJpQJpO52-8OSjuveW4HbXLIhB8",
  authDomain: "server-services-50a49.firebaseapp.com",
  projectId: "server-services-50a49",
  storageBucket: "server-services-50a49.appspot.com",
  messagingSenderId: "484734300353",
  appId: "1:484734300353:web:e114a73b06c46823c72440",
  measurementId: "G-SJVFBE0VY0",
};

firebase.initializeApp(firebaseConfig);

const messaging = getMessaging();

export default {
  components: {
    RouterView,
    Loader
  },

  data() {
    return {
      loading: false,
      fcmToken: null,
      themeManager: useThemeManager()
    };
  },

  async mounted() {
    this.themeManager = useThemeManager();
    this.loading = true;
    await this.initializeApp(); // Initialize app and check FCM permissions
    this.setMessageHandler(); // Set the global message handler for notifications
  },

  methods: {
    // Initialize the app by fetching config and initializing Firebase Messaging (FCM)
    async initializeApp() {
      try {
        await this.fetchAppConfig();  // Fetch app configuration (e.g., title, favicon)
        await this.checkAndRequestPermission();  // Check notification permission
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch application configuration (e.g., title, logo) and update the page metadata
    async fetchAppConfig() {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`);
      const data = await response.json();
      document.title = data.data[0].appName;
      document.querySelector('link[rel="icon"]').href = data.data[0].logo;
    },

    // Check and request permission for notifications
    async checkAndRequestPermission() {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log("Notifications are enabled.");
          await this.initializeFCM(); // Initialize FCM when permission is granted
        } else {
          alert("You have denied notifications. Please enable them in your browser settings if you change your mind.");
        }
      } else if (Notification.permission === 'granted') {
        console.log("Notifications are already enabled.");
        await this.initializeFCM(); // If already granted, initialize FCM
      } else {
        alert("Please enable notifications in your browser settings to stay updated.");
      }
    },

    // Initialize Firebase Cloud Messaging (FCM) and get token
    async initializeFCM() {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: 'BBMLeMHCNGuQapVD-kTi7bhKL5C3iha-_MIZ0jbSoz4VoNUj3SnOM0Za8e2RIn-nR_PQX6_xW2qWEg7m1zfoZTg'
        });

        if (currentToken) {
          this.fcmToken = currentToken;
          localStorage.setItem('fcm_token', currentToken);
          console.log('FCM Token:', currentToken);
          await this.registerFCMToken(currentToken);  // Optionally register the token with the server
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving the token:', err);
      }
    },

    // Register FCM token with the server (optional, based on your use case)
    async registerFCMToken(token) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.log('User not logged in. FCM token not registered.');
        return;
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/fcm/users/token`, {
          userId: userId,
          token: token
        });
        console.log('FCM token registered successfully:', response.data);
      } catch (error) {
        console.error('Error registering FCM token:', error);
      }
    },

    // Set up a message handler to listen for incoming notifications
    setMessageHandler() {
      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // Handle the message here, e.g., display a notification
      });
    },

    // Manually trigger a notification for testing purposes
    async sendNotification() {
      const hasPermission = await this.checkAndRequestPermission();
      if (hasPermission && this.fcmToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/fcm/users/notify`, {
            title: "Test Notification",
            body: "Hey there! Just trying out if this works",
            icon: 'https://firebasestorage.googleapis.com/v0/b/server-services-50a49.appspot.com/o/logo%2FScreenshot_20240510_045310-removebg-preview.png?alt=media&token=ff6f9f88-e670-48c5-acf6-de2244f7ed9d',
            registrationToken: this.fcmToken
          });
          console.log('Notification sent:', response.data);
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    }
  },

  watch: {
    '$route' (to, from) {
      const currentUserId = localStorage.getItem('userId');
      if (currentUserId && !this.fcmToken) {
        this.initializeFCM();
      } else if (!currentUserId && this.fcmToken) {
        this.fcmToken = null;
        localStorage.removeItem('fcm_token');
      }
    }
  }
};
</script>

<template>
  <Loader v-if="loading" />
  <a-config-provider v-else :theme="themeManager.antDesignTheme">

    <main >
      <router-view></router-view>
    </main>

  </a-config-provider>
</template>
