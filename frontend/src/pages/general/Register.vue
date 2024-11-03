<template>
  <main style="display: flex">
    <div class="imageContainer">
      <div class="imageContent">
        <div class="welcomeRemarks">
          <h2>Welcome to Akuka Lodge</h2>
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

    <div class="formContainer">
      <div class="innerFormContainer">
        <div class="logoText">
          <h2>Akuka<span style="color: whitesmoke">Lodge</span></h2>
        </div>
        <div class="logoContainer">
          <img class="logo" src="@/assets/Images/LOGO.png" alt="Brand Logo" />
        </div>

        <!-- Step Progress -->
        <div class="stepProgress">
          <div
            class="step"
            :class="{ active: currentStep === 1, completed: currentStep > 1 }"
            @click="goToStep(1)"
          >
            <span>1</span>
            <div class="step-description">
              <p v-if="currentStep === 1">Enter Email</p>
              <p v-else-if="currentStep > 1" class="p-confirmed">Email Entered</p>
            </div>
          </div>
          <div
            class="step"
            :class="{ active: currentStep === 2, completed: currentStep > 2 }"
            @click="goToStep(2)"
          >
            <span>2</span>
            <div class="step-description">
              <p v-if="currentStep < 2 || currentStep === 2">Confirm Code</p>
              <p v-else-if="currentStep > 2" class="p-confirmed">Code Confirmed</p>
            </div>
          </div>
          <div
            class="step"
            :class="{ active: currentStep === 3, completed: currentStep > 3 }"
            @click="goToStep(3)"
          >
            <span>3</span>
            <div class="step-description">
              <p v-if="currentStep < 3 || currentStep === 3">Sign up</p>
              <p v-else-if="currentStep > 3" class="p-confirmed">Registration Complete</p>
            </div>
          </div>
        </div>

        <!-- Step 1: Email -->
        <div v-if="currentStep === 1">
          <div class="formFooter">
            <h1 style="font-size: 40px">Get Started</h1>
          </div>

          <form class="my-form" @submit.prevent="handleEmailSubmit">
            <div class="inputDiv">
              <input
                class="my-input"
                type="email"
                name="Email"
                ref="email"
                placeholder="Please enter your email address"
                v-model="email"
              />
            </div>
            <div class="error-message" v-if="emailError">{{ emailError }}</div>

            <div class="button">
              <button
                v-if="!sLoading"
                class="my-button"
                type="submit"
                name="user_signUp_submit"
                :disabled="!email"
              >
                continue
              </button>
              <div v-else>
                <Loader />
              </div>
            </div>

            <div class="formFooter">
              <h5>
                Already have an account?
                <router-link to="/login" style="color: #81d742"
                  >Log in</router-link
                >
              </h5>
            </div>
          </form>
        </div>

        <!-- Step 2: Confirmation Code -->
        <div v-else-if="currentStep === 2">
          <div class="formFooter">
            <h1 style="font-size: 40px">Enter 6-digit verification code</h1>
            <br />
            <p>We sent you a verification code. Check your email.</p>
          </div>

          <form class="my-form" @submit.prevent="handleConfirmation">
            <div class="inputDiv">
              <input
                class="my-input"
                type="text"
                maxlength="6"
                placeholder="Enter 6-digit code"
                v-model="confirmationCode"
              />
            </div>
            <div class="error-message" v-if="confirmationCodeError">
              {{ confirmationCodeError }}
            </div>

            <div class="button">
              <div v-if="sLoading">
                <Loader />
              </div>
              <button
                v-else
                class="my-button"
                type="submit"
                :disabled="confirmationCode.length !== 6 || sLoading"
              >
                Confirm
              </button>
            </div>

            <div class="formFooter">
              <h5>
                Already have an account?
                <router-link to="/login" style="color: #81d742"
                  >Log in</router-link
                >
              </h5>
            </div>
          </form>
        </div>

        <!-- Step 3: Registration -->
        <div v-else-if="currentStep === 3">
          <div class="formFooter">
            <h1 style="font-size: 40px">Register</h1>
          </div>

          <form class="my-form" @submit.prevent="handleRegister">
            <div class="inputDiv">
              <input
                class="my-input"
                type="text"
                name="fullName"
                ref="fullName"
                placeholder="Full Name"
                v-model="fullName"
              />
            </div>
            <div class="error-message" v-if="fullNameError">
              {{ fullNameError }}
            </div>

            <div class="inputDiv">
              <input
                class="my-input"
                type="number"
                name="phoneNumber"
                ref="phoneNumber"
                placeholder="Phone Number"
                v-model="phoneNumber"
              />
            </div>
            <div class="error-message" v-if="phoneNumberError">
              {{ phoneNumberError }}
            </div>
            <div class="inputFlex">
              <input
                type="password"
                class="form-control my-input"
                ref="password"
                name="Password"
                placeholder="Password"
                v-model="password"
              />
              <div class="showIco" ref="show_eye">
                <i class="fa fa-eye" @click="showPassword"></i>
              </div>
              <div class="showIco1" ref="hide_eye">
                <i class="fa fa-eye-slash" @click="hidePassword"></i>
              </div>
            </div>
            <div class="error-message" v-if="passwordError">
              {{ passwordError }}
            </div>
            <div class="inputFlex">
              <input
                type="password"
                class="form-control my-input"
                name="confirmPassword"
                ref="password2"
                placeholder="Confirm Password"
                v-model="confirmPassword"
              />
              <div class="showIco" ref="show_eye2">
                <i class="fa fa-eye" @click="showPassword2"></i>
              </div>
              <div class="showIco1" ref="hide_eye2">
                <i class="fa fa-eye-slash" @click="hidePassword2"></i>
              </div>
            </div>
            <div class="error-message" v-if="confirmPasswordError">
              {{ confirmPasswordError }}
            </div>
            <div class="button">
              <button
                v-if="!sLoading"
                class="my-button"
                type="submit"
                name="user_signUp_submit"
                :disabled="
                  !fullName ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !phoneNumber ||
                  password !== confirmPassword
                "
              >
                Sign Up
              </button>
              <div v-else>
                <Loader />
              </div>
            </div>

            <div class="formFooter">
              <h5>
                Already have an account?
                <router-link to="/login" style="color: #81d742"
                  >Log in</router-link
                >
              </h5>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Loader from "@/components/LoaderAlt.vue";

export default {
  name: "Register",
  data() {
    return {
      base: import.meta.env.VITE_APP_API_URL,
      sLoading: false,
      confirmationCode: "", // Store the confirmation code as a single string
      currentStep: 1, // Initial step
      email: "", // Store the email entered in the email form
      fullName: "", // Store the full name entered in the registration form
      phoneNumber: "", // Store the phone number entered in the registration form
      password: "", // Store the password entered in the registration form
      confirmPassword: "", // Store the confirm password entered in the registration form
      randomString: "", // Store the random byte string
      emailError: "", // Store the email error message
      confirmationCodeError: "", // Store the confirmation code error message
      fullNameError: "", // Store the full name error message
      phoneNumberError: "", // Store the phone number error message
      passwordError: "", // Store the password error message
      confirmPasswordError: "", // Store the confirm password error message
    };
  },
  components: {
    Loader,
  },
  mounted() {
    // Generate a random byte string and store it in localStorage
    this.randomString = this.generateRandomString(16);
    localStorage.setItem("randomString", this.randomString);
  },
  beforeUnmount() {
    // Remove the random string from localStorage when the component is unmounted
    localStorage.removeItem("randomString");
  },
  methods: {
    generateRandomString(length) {
      // Function to generate a random byte string
      const bytes = new Uint8Array(length);
      const crypto = window.crypto || window.msCrypto;
      crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    },
    async handleEmailSubmit() {
      this.sLoading = true;
      try {
        const email = this.$refs.email.value.trim();

        // Reset error message
        this.emailError = "";

        // Validate email
        if (!email) {
          this.emailError = "Please enter your email address!";
          return;
        }

        // Validate email format
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
          this.emailError = "Please enter a valid email address!";
          return;
        }

        // Store the email for later use
        this.email = email;

        // Submit the email and random string
        const data = JSON.stringify({
          email,
          string: this.randomString,
        });

        const response = await axios.post(
          `${this.base}/api/v1/auth/save-code`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        // Check if the response is successful
        if (response.data && response.data.success) {
          this.currentStep = 2;
        } else {
          // Handle error
          console.error("Error submitting email:", response.data.message);
          this.emailError = response.data.message;
        }
      } catch (error) {
        console.error("Error submitting email:", error);
        this.emailError = error.response.data.message;
      } finally {
        this.sLoading = false;
      }
    },
    async handleConfirmation() {
      this.sLoading = true;
      try {
        this.confirmationCodeError = "";
        const data = JSON.stringify({
          string: this.randomString,
          code: this.confirmationCode,
        });
        const response = await axios.post(
          `${this.base}/api/v1/auth/confirm-email`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.success) {
          toast.success("code confirmed successfully!", {
            autoClose: 5000,
          });
          this.currentStep = 3;
        } else {
          console.error("Error confirming code:", response.data.message);
          this.confirmationCodeError = response.data.message;
        }
      } catch (error) {
        console.error("Error confirming code:", error);
        this.confirmationCodeError = error.response.data.message;
      } finally {
        this.sLoading = false;
      }
    },
    async handleRegister() {
      try {
        // Reset error messages
        this.fullNameError = "";
        this.phoneNumberError = "";
        this.passwordError = "";
        this.confirmPasswordError = "";

        // Get values from the form
        const fullName = this.fullName.trim();
        const phoneNumber = this.phoneNumber.toString().trim();
        const email = this.email; // Use the email stored from the email form
        const password = this.password.trim();
        const confirmPassword = this.confirmPassword.trim();

        // Validate form data (you can add more validation as needed)
        if (!fullName) {
          this.fullNameError = "Please enter your full name!";
        }
        if (!phoneNumber) {
          this.phoneNumberError = "Please enter your phone number!";
        }
        if (!password) {
          this.passwordError = "Please enter a password!";
        }
        if (!confirmPassword) {
          this.confirmPasswordError = "Please confirm your password!";
        }
        if (password !== confirmPassword) {
          this.passwordError = "Passwords do not match!";
          this.confirmPasswordError = "Passwords do not match!";
        }

        // Check if any error messages are present
        if (
          this.fullNameError ||
          this.phoneNumberError ||
          this.passwordError ||
          this.confirmPasswordError
        ) {
          return;
        }

        this.sLoading = true;

        const data = JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber,
        });

        const response = await axios.post(
          `${this.base}/api/v1/auth/register`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              // Optionally, you may include Authorization header if needed
              // Authorization: `Bearer ${this.authToken}`,
            },
          }
        );

        // Check if the response contains success message
        if (response.data && response.data.message) {
          this.$swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
          });
        }

        // Redirect to login page
        this.$router.push("/login");
      } catch (error) {
        console.error("Error registering user:", error);

        // Handle error response
        let errorMessage = "An error occurred while registering";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        if (Array.isArray(errorMessage)) {
          this.$swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage[0].msg,
          });
        } else {
          this.$swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
          });
        }
      } finally {
        this.sLoading = false;
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
    togglePasswordVisibility2(isVisible) {
      const passw = this.$refs.password2;
      const hideIco = this.$refs.hide_eye2;
      const showIco = this.$refs.show_eye2;

      hideIco.style.display = isVisible ? "none" : "block";
      showIco.style.display = isVisible ? "block" : "none";
      passw.type = isVisible ? "password" : "text";
    },
    hidePassword2() {
      this.togglePasswordVisibility2(true);
    },
    showPassword2() {
      this.togglePasswordVisibility2(false);
    },
    goToStep(step) {
      // Check if the user can go to the desired step
      if (
        step === 1 ||
        (step === 2 && this.email) ||
        (step === 3 && this.confirmationCode)
      ) {
        this.currentStep = step;
      } else {
        // Display an error message or handle the case when the user can't go to the desired step
        console.log("You can't go to this step yet.");
        this.$swal.fire({
          icon: "warning",
          title: "..Oops!",
          text: "You can't go to this step yet.",
        });
      }
    },
  },
};
</script>

<style scoped>
p {
  font-size: 16px;
}

/* Step Progress Styles */
.stepProgress {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5vh;
  margin-bottom: 20px;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.step::before,
.step::after {
  content: "";
  position: absolute;
  height: 2px;
  background-color: #ccc;
  top: 50%;
  transform: translateY(-50%);
  z-index: -1;
}

.step::before {
  left: calc(-100% - 20px);
  width: calc(100% + 40px);
}

.step::after {
  right: calc(-100% - 20px);
  width: calc(100% + 40px);
}

.step:first-child::before,
.step:last-child::after {
  content: none;
}

.step span {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ccc;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.step.active span {
  background-color: #81d742;
}

.step.completed span {
  background-color: #4caf50;
}

.step-description {
  margin-top: 17px;
  text-align: center;
}

.p-confirmed{
  color: #4caf50;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 5px;
}
</style>
