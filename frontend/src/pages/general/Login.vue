<template>
  <main style="display: flex">
    <div class="imageContainer">
      <div class="imageContent">
        <div class="welcomeRemarks">
          <h1>Welcome to Akuka Lodge</h1>
        </div>
        <div class="formFooter">
          <h2 style="color: white; font-size: 25px">
            Login to get started or
            <span style="color: #81d742">Sign Up</span> if you don't have an
            account
          </h2>
        </div>
      </div>
    </div>

    <!--Container holding all form elements-->
    <div class="formContainer">
      <div class="innerFormContainer">
        <div class="logoText">
          <h1>Akuka<span style="color: whitesmoke">Lodge</span></h1>
        </div>
        <div class="logoContainer">
          <img class="logo" src="@/assets/Images/LOGO.png" alt="Brand Logo" />
        </div>
        <div style="margin-top: 10vh" class="formFooter">
          <h2 style="font-size: 40px">Log In</h2>
        </div>

        <!-- Login form-->
        <form class="my-form" @submit.prevent="handleLogin">
          <div class="inputDiv">
            <input
              class="my-input"
              type="email"
              name="email"
              ref="email"
              placeholder="Email"
            />
          </div>
          <div class="inputFlex">
            <input
              type="password"
              class="my-input"
              name="password"
              ref="password"
              placeholder="Password"
            />
            <div class="showIco" ref="show_eye">
              <i class="fa fa-eye" @click="showPassword"></i>
            </div>
            <div class="showIco1" ref="hide_eye">
              <i class="fa fa-eye-slash" @click="hidePassword"></i>
            </div>
          </div>

          <div class="button">
            <button
              button
              v-if="!lLoading"
              class="my-button"
              type="submit"
              name="user_login_submit"
            >
              Log in
            </button>
            <div v-else>
              <Loader />
            </div>
          </div>
          <div class="formFooter">
            <h5>
              <a href="/request-reset" class="rec" style="cursor: pointer"
                >Fogort password ?</a
              >
            </h5>
            <h5>
              <br />
              <span class="rec">Don't have an account?</span>
              <a href="/register" style="color: #81d742; cursor: pointer">
                sign up</a
              >
            </h5>
          </div>
        </form>
        <h3 style="margin-left: 50%; color: yellowgreen;">or</h3>
        <div class="google-signin-container">
  
          <button @click="signInWithGoogle">
            <v-icon name="fa-google"></v-icon>
            Continue with Google</button>
        </div>
      </div>
    </div>
  </main>
</template>



<script>
import { RouterLink } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axios from "axios";
import Loader from "@/components/LoaderAlt.vue";

import { googleSdkLoaded } from "vue3-google-login";
import userStore from "../../executables/userStore";

export default {
  data() {
    return {
      lLoading: false,
      base: import.meta.env.VITE_APP_API_URL,
    };
  },
  components: {
    Loader,
  },
  methods: {
    signInWithGoogle() {
      googleSdkLoaded((google) => {
        google.accounts.oauth2
          .initCodeClient({
            client_id: userStore.clientId.value,
            scope: "email profile openid",
            redirect_uri: "https://www.akukalodge.com ",
            callback: (response) => {
              if (response.code) userStore.fetchUserDataFrom(response.code);
            },
          })
          .requestCode();
      });
    },
    async handleLogin() {
      try {
        const email = this.$refs.email.value;
        const password = this.$refs.password.value;

        if (!email || !password) {
          this.$swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all fields!",
          });
          return;
        }

        this.lLoading = true;

        const data = JSON.stringify({ email, password });

        const response = await axios.post(
          `${this.base}/api/v1/auth/login`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("role", response.data.role);

        // Check if the response contains success message
        if (response.data && response.data.message) {
          this.$swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
          });
        }

        if (response.data.role === "Guest") {
          // Redirect to the my bookings
          this.$router.push("/my-bookings");
        } else {
          // Redirect to dashboard
          this.$router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error logging in:", error);

        // Handle error response
        let errorMessage = "An error occurred while logging in";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.$swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      } finally {
        this.lLoading = false;
      }
    },
    togglePasswordVisibility(isVisible) {
      const passw = this.$refs.password;
      const hideIco = this.$refs.hide_eye;
      const showIco = this.$refs.show_eye;

      hideIco.style.display = isVisible ? "none" : "block";
      showIco.style.display = isVisible ? "block" : "none";
      passw.type = isVisible ? "password" : "text";
    },
    hidePassword() {
      this.togglePasswordVisibility(true);
    },
    showPassword() {
      this.togglePasswordVisibility(false);
    },
  },
};
</script>
