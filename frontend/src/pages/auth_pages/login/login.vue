<template>
  <component :is="currentLayout" 
    :email="email" 
    :password="password" 
    :showPassword="showPassword" 
    :isLoggingIn="isLoggingIn"
    :error="error"
    :config="config"
    @update:email="email = $event"
    @update:password="password = $event"
    @toggle-password="showPassword = !showPassword"
    @submit="handleLogin"
  />
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// Import layout components
import DefaultLayout from './layouts/default_layout.vue';
import CenteredLayout from './layouts/centered_layout.vue';
import SplitLayout from './layouts/split_layout.vue';
import MinimalLayout from './layouts/minimal_layout.vue';
import CardLayout from './layouts/card_layout.vue';



export default {
  components: {
    DefaultLayout,
    CenteredLayout,
    SplitLayout,
    MinimalLayout,
    CardLayout,
  },
  data() {
    return {
      loading: false,
      isLoggingIn: false,
      config: {},
      showPassword: false,
      email: "",
      password: "",
      error: "",
      selectedLayout: 'CenteredLayout',
      layouts: [
        'DefaultLayout',
        'CenteredLayout',
        'SplitLayout',
        'MinimalLayout',
        'CardLayout'
      ],
    };
  },
  computed: {
    currentLayout() {
      return this.layouts.includes(this.selectedLayout) ? this.selectedLayout : 'DefaultLayout';
    },
  },
  mounted() {
    this.fetchSystemConfig();
  },
  methods: {
    async fetchSystemConfig() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`
        );
        this.config = response.data.data[0];
        console.log(response.data.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async handleLogin() {
  this.isLoggingIn = true;
  try {
    const data = JSON.stringify({
      email: this.email,
      password: this.password,
    });

    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/api/v1/users/login`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    /*/ Check if the account is active
    if (!response.data.user.isAccountActive) {
      toast.error("Your account has been deactivated.  Please contact admin for more assistance.", {
        autoClose: 8000,
      });
      return; // Stop further execution if account is inactive
    }
    */

    // Set authToken and user information in local storage
    localStorage.setItem("authToken", response.data.accessToken);
    localStorage.setItem("userName", response.data.user.fullname);
    localStorage.setItem("userId", response.data.user._id);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("userImage", response.data.user.undefined || "https://static.vecteezy.com/system/resources/thumbnails/003/337/634/small/profile-placeholder-default-avatar-vector.jpg"); // Adjust this line if `image` is undefined
    localStorage.setItem("systemlogo", this.config.logo);
    localStorage.setItem("systemname", this.config.name);
    localStorage.setItem("role", response.data.user.role);
    localStorage.setItem("userEmail", response.data.user.email);

    this.$swal.fire({
      icon: "success",
      title: "Success!",
      text: response.data.message,
    });
    this.$router.push("/dashboard");
  } catch (error) {
    console.error("Error logging in:", error);

    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error, {
        autoClose: 2000,
      });
    } else {
      toast.error("An unknown error occurred while logging in.", {
        autoClose: 2000,
      });
    }
  } finally {
    this.isLoggingIn = false;
  }
}

  },
};
</script>