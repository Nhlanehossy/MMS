<template>
  <div 
    class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8"
    :style="backgroundStyle"
  >
    <div class="max-w-md w-full space-y-8 bg-menubg rounded-lg shadow-xl p-8">
      <!-- Logo and title -->
      <div class="text-center">
        <Logo class="mx-auto h-16 w-auto" />
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="$emit('submit')">
        <div class="rounded-md shadow-sm space-y-4">
          <!-- Email input -->
          <div>
            <label for="email" class="block text-sm font-medium text-webBackgroundHover mb-1">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text bg-cardDark focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
              placeholder="Enter your email"
              :value="email"
              @input="$emit('update:email', $event.target.value)"
            />
          </div>
          <!-- Password input -->
          <div class="relative">
            <label for="password" class="block text-sm font-medium text-webBackgroundHover mb-1">Password</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              name="password"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text bg-cardDark focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm pr-10"
              placeholder="Enter your password"
              :value="password"
              @input="$emit('update:password', $event.target.value)"
            />
            <!-- Show/hide password button -->
            <button
              type="button"
              @click="$emit('toggle-password')"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            >
              <!-- (SVG for show/hide password) -->
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-text">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="/forgot-password" class="font-medium text-secondary hover:text-tertiary">
              Forgot password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoggingIn"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-textLight bg-secondary hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150 ease-in-out"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- (SVG for login icon) -->
            </span>
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

      <!-- Error message -->
      <div v-if="error" class="mt-4 text-center text-sm text-red-500">{{ error }}</div>

      <p class="mt-8 text-center text-xs text-textLighter">
        &copy; {{ new Date().getFullYear() }} {{ config.appName }} | Version {{ config.appVersion }}
      </p>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/u_i/sf_logo.vue";

export default {
  components: { Logo },
  props: ['email', 'password', 'showPassword', 'isLoggingIn', 'error', 'config'],
  emits: ['update:email', 'update:password', 'toggle-password', 'submit'],
  data() {
    return {
      backgroundImage: 'https://images.pexels.com/photos/7688374/pexels-photo-7688374.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // You can set a default image URL here if desired
    }
  },
  computed: {
    backgroundStyle() {
      return this.backgroundImage
        ? { backgroundImage: `url(${this.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {};
    }
  },
  methods: {
    setBackgroundImage(url) {
      this.backgroundImage = url;
    }
  }
}
</script>