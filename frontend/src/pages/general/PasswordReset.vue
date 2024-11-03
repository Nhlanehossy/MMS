<template>
  <main
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        font-size: 16px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        padding: 20px;
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
      "
    >
      <div style="text-align: center; margin-bottom: 20px">
        <img
          src="@/assets/Images/LOGO.png"
          alt="Logo"
          style="max-width: 200px"
        />
      </div>
      <div
        style="
          text-align: center;
          padding: 20px;
          background-color: #fff;
          color: #333;
          border-radius: 5px;
        "
      >
        <h2>Reset Password</h2>
        <p>Enter a new password for your account.</p>
        <form @submit.prevent="resetPassword">
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            required
            style="width: 100%; padding: 10px; margin-bottom: 10px"
          />
          <div style="position: relative; margin-bottom: 10px">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="newPassword"
              placeholder="New Password"
              required
              style="width: 100%; padding: 10px; padding-right: 40px"
              :class="{ 'is-invalid': showPasswordError }"
            />
            <span
              style="
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
              "
              @click="showNewPassword = !showNewPassword"
            >
              <v-icon v-if="!showNewPassword" name="fa-eye"></v-icon>
              <v-icon v-else name="fa-eye-slash"></v-icon>
            </span>
          </div>
          <div v-if="showPasswordError" class="invalid-feedback">
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, and one number.
          </div>
          <div style="position: relative; margin-bottom: 10px">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              required
              style="width: 100%; padding: 10px; padding-right: 40px"
              :class="{ 'is-invalid': confirmPasswordError }"
            />
            <span
              style="
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
              "
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <v-icon v-if="!showConfirmPassword" name="fa-eye"></v-icon>
              <v-icon v-else name="fa-eye-slash"></v-icon>
            </span>
          </div>
          <div v-if="confirmPasswordError" class="invalid-feedback">
            Passwords do not match.
          </div>
          <br />
          <button
             v-if="!loading"
            type="submit"
            :disabled="!isFormValid"
            style="
              width: 100%;
              padding: 10px;
              background-color: #333;
              color: #fff;
            "
          >
            Reset Password
          </button>
          <div v-else>
            <LoaderAlt/>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import LoaderAlt from '@/components/LoaderAlt.vue';

export default {
  data() {
    return {
      loading:false,
      email: "",
      newPassword: "",
      confirmPassword: "",
      showNewPassword: false,
      showConfirmPassword: false,
      base: import.meta.env.VITE_APP_API_URL,

    };
  },
  components:{LoaderAlt},
  computed: {
    isPasswordValid() {
    const password = this.newPassword;
    const minLength = 8;

    // Check if password length is at least minLength
    if (password.length < minLength) {
        return false;
    }

    // Check if password contains at least one lowercase letter
    let hasLowerCase = false;
    for (let i = 0; i < password.length; i++) {
        if (password[i] >= 'a' && password[i] <= 'z') {
            hasLowerCase = true;
            break;
        }
    }
    if (!hasLowerCase) {
        return false;
    }

    // Check if password contains at least one uppercase letter
    let hasUpperCase = false;
    for (let i = 0; i < password.length; i++) {
        if (password[i] >= 'A' && password[i] <= 'Z') {
            hasUpperCase = true;
            break;
        }
    }
    if (!hasUpperCase) {
        return false;
    }

    // Check if password contains at least one digit
    let hasDigit = false;
    for (let i = 0; i < password.length; i++) {
        if (password[i] >= '0' && password[i] <= '9') {
            hasDigit = true;
            break;
        }
    }
    if (!hasDigit) {
        return false;
    }

    // If all conditions are met, password is valid
    return true;
}
,
    showPasswordError() {
      return !this.isPasswordValid && this.newPassword.length > 0;
    },
    confirmPasswordError() {
      return (
        this.newPassword !== this.confirmPassword &&
        this.confirmPassword.length > 0
      );
    },
    isFormValid() {
      return (
        this.isPasswordValid &&
        this.newPassword === this.confirmPassword &&
        this.email
      );
    },
  },
  methods: {
    async resetPassword() {
      if (this.isFormValid) {
        // Send the new password and email to your server
        // Handle the response and show appropriate messages
        console.log("New password:", this.newPassword);
        console.log("Email:", this.email);

        try {
          if (!this.email || !this.newPassword) {
            this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please fill in all details!",
            });
            return;
          }

          this.loading = true;

          const data = JSON.stringify({
            email: this.email,
            newPassword: this.newPassword,
          });

          const response = await axios.put(
            `${this.base}/api/v1/auth/password-reset`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          this.$swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
          });

          this.$router.push("/login");
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
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.invalid-feedback {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}
.is-invalid {
  border: 1px solid red;
}

@media (max-width: 600px) {
  main {
    padding: 20px;
  }
}
</style>
