<template>
    <main class="main-container">
      <div class="container" v-if="lLoading">
        <div class="logo-img-container">
          <img
            src="@/assets/Images/LOGO.png"
            alt="Logo"
            class="logo-img"
          />
        </div>
        <div class="loading-container">
          <LoaderAlt />
        </div>
      </div>
      <div class="container" v-else>
        <div v-if="showSuccesMessage">
          <div class="logo-img-container">
            <img
              src="@/assets/Images/LOGO.png"
              alt="Logo"
              class="logo-img"
            />
          </div>
          <div class="success-message-container">
            <h3>
              We have sent you a password reset link to {{ email }}
              <a href="#" @click.prevent="sendPasswordResetRequest">(Resend Email)</a>
            </h3>
          </div>
        </div>
        <div v-else class="">
          <div class="logo-img-container">
            <img
              src="@/assets/Images/LOGO.png"
              alt="Logo"
              class="logo-img"
            />
          </div>
          <div class="form-container">
            <h2>Password Reset Request</h2>
            <p>Enter your email address to receive a password reset link.</p>
            <form @submit.prevent="sendPasswordResetRequest">
              <input type="email" v-model="email" placeholder="Email" required />
              <br /><br />
              <button type="submit">Send Reset Link</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import axios from "axios";
  import LoaderAlt from "@/components/LoaderAlt.vue";
  export default {
    data() {
      return {
        base: import.meta.env.VITE_APP_API_URL,
        lLoading: false,
        showSuccesMessage: false,
        email: "",
      };
    },
    components: { LoaderAlt },
    methods: {
      async sendPasswordResetRequest() {
        try {
          if (!this.email) {
            this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please fill in your email!",
            });
            return;
          }
  
          this.lLoading = true;
  
          const data = JSON.stringify({ email: this.email });
  
          const response = await axios.post(
            `${this.base}/api/v1/auth/request-reset`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          this.showSuccesMessage = true;
        } catch (error) {
          console.error("Error logging in:", error);
  
          // Handle error response
          let errorMessage = "An error occurred ";
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
    },
  };
  </script>
  
  <style scoped>
  .main-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .container {
    max-width: 600px;
    margin: 20px;
    font-size: 16px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
  }
  
  .logo-img-container {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .logo-img {
    width: 200px;
  }
  
  .loading-container,
  .success-message-container,
  .form-container {
    text-align: center;
    padding: 20px;
    background-color: #fff;
    color: #333;
    border-radius: 5px;
  }
  </style>