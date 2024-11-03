<script>
import { RouterView } from 'vue-router';
import Loader from "./components/u_i/sf_loader_alt.vue";
import { useThemeManager } from './executables/themeManager';

export default {
  components: {
    RouterView,
    Loader
  },

  data() {
    return {
      loading: false,
      themeManager: useThemeManager()
    };
  },

  async mounted() {
    this.themeManager = useThemeManager();
    this.loading = true;
    await this.initializeApp(); // Initialize app
  },

  methods: {
    // Initialize the app by fetching config
    async initializeApp() {
      try {
        await this.fetchAppConfig();  // Fetch app configuration (e.g., title, favicon)
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
    }
  },

  watch: {
    '$route' (to, from) {
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) {
        localStorage.removeItem('fcm_token');
      }
    }
  }
};
</script>

<template>
  <Loader v-if="loading" />
  <a-config-provider v-else :theme="themeManager.antDesignTheme">
    <main>
      <router-view></router-view>
    </main>
  </a-config-provider>
</template>
