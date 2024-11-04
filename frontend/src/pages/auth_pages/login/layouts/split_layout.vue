<template>
  <div class="h-screen  flex flex-row bg-gray-50">
    <!-- Left Section (Sign-in Form) -->
    <div
      class="w-full lg:w-5/12 bg-cardDark flex flex-col justify-center py-8 px-6 sm:px-6 lg:px-8 xl:px-12 form-container scaled-content">
      <div class="mx-auto w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center lg:text-left">
          <Logo class="h-8 w-auto mx-auto lg:mx-0" />
          <h2 class="mt-4 text-xl font-extrabold text-secondary">Sign in to your account</h2>

        </div>

        <!-- Form Section -->
        <div class="mt-8">
          <form @submit.prevent="$emit('submit')" class="space-y-3">
            <!-- Email Input -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-400">Email address</label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required
                  class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary text-sm"
                  :value="email" @input="$emit('update:email', $event.target.value)" />
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-400">Password</label>
              <div class="mt-1 relative">
                <input :type="showPassword ? 'text' : 'password'" id="password" name="password"
                  autocomplete="current-password" required
                  class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary text-sm"
                  :value="password" @input="$emit('update:password', $event.target.value)" />
                <div @click="$emit('toggle-password')"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </div>
              </div>
            </div>

             <!-- Remember Me & Forgot Password 
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox"
                  class="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded" />
                <label for="remember-me" class="ml-2 block text-xs sm:text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <div class="text-xs sm:text-sm">
                <a href="/forgot-password" class="font-medium text-secondary hover:text-secondary-dark">
                  Forgot password?
                </a>
              </div>
            </div> -->

            <!-- Sign In Button -->
            <div>

              <button type="submit" :disabled="isLoggingIn"
                class="w-full h-12 items-center flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                {{ isLoggingIn ? 'Signing in...' : 'Sign in' }}
              </button>

              <p class="mt-3 text-center text-xs sm:text-sm text-gray-500">
                By continuing, you agree to our
                <a href="/terms-and-conditions" class="text-secondary underline">Terms & Conditions</a>,
                and acknowledge our
                <a href="/privacy-policy" class="text-secondary underline">Privacy Policy</a>.
              </p>
            </div>
          </form>


          <!-- Error Message -->
          <div v-if="error" class="mt-3 text-center text-sm text-red-600">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section (Image Slideshow or Background) -->
    <div class="hidden lg:block lg:w-7/12 relative bg-gray-100 h-full overflow-hidden right-content">
      <div class="absolute inset-0">
        <DataFetcher resource="slides" :limit="2">
          <template #default="{ data, error, loading }">
            <div v-if="loading" class="h-full w-full flex items-center justify-center">
              <p class="text-gray-500">Loading...</p>
            </div>
            <div v-else-if="error || !data" class="h-screen w-full flex items-center justify-center">
              
            </div>
            <div v-else class="h-full w-full">
              <SlideShow :slides="data" class="h-full w-full" />
            </div>
          </template>
        </DataFetcher>
      </div>
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../../../firebase';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import Logo from "@/components/u_i/sf_logo.vue";
import SlideShow from "@/components/u_i/sf_slideshow.vue";
import DataFetcher from "@/components/DataFetcher.vue";

export default {
  components: { Logo, SlideShow, DataFetcher },
  props: ['email', 'password', 'showPassword', 'isLoggingIn', 'error'],
  emits: ['update:email', 'update:password', 'toggle-password', 'submit', 'social-login'],
  methods: {
    async handleGoogleLogin() {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.$emit('social-login', result.user);
      } catch (error) {
        console.error("Error during Google sign-in:", error);
      }
    },
    async handleFacebookLogin() {
      try {
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.$emit('social-login', result.user);
      } catch (error) {
        console.error("Error during Facebook sign-in:", error);
      }
    },
  },
};
</script>
<style>
.right-content {
  background-image: url('https://malawi24.com/wp-content/uploads/2015/12/Mzuni.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>