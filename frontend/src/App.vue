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
        console.warn("Using default app configuration:", error.message);
      } finally {
        this.loading = false;
      }
    },

    // Fetch application configuration (e.g., title, logo) and update the page metadata
    async fetchAppConfig() {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`);
      if (!response.ok) {
        throw new Error(`System configuration request failed with status ${response.status}`);
      }
      const data = await response.json();
      const config = data.data?.[0];
      if (!config) return;
      document.title = config.appName || document.title;
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon && config.logo) {
        favicon.href = config.logo;
      }
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
  <router-view v-else v-slot="{ Component }">
    <a-config-provider :theme="themeManager.antDesignTheme">
      <main>
        <component :is="Component" />
      </main>
    </a-config-provider>
  </router-view>
</template>
