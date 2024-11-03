<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="px-6 py-8">
            <div class="text-center">
              <Logo class="mx-auto h-12 w-auto" />
              <h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
              <p class="mt-2 text-sm text-gray-600">Sign in to your account</p>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="$emit('submit')">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                <input id="email" name="email" type="email" autocomplete="email" required
                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                       :value="email"
                       @input="$emit('update:email', $event.target.value)">
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="mt-1 relative">
                  <input :type="showPassword ? 'text' : 'password'" name="password" autocomplete="current-password" required
                         class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                         :value="password"
                         @input="$emit('update:password', $event.target.value)">
                  <button type="button" @click="$emit('toggle-password')" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                  <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div class="text-sm">
                  <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
              </div>
              <div>
                <button type="submit" :disabled="isLoggingIn"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {{ isLoggingIn ? 'Signing in...' : 'Sign in' }}
                </button>
              </div>
            </form>
          </div>
          <div v-if="error" class="px-6 py-4 bg-red-50 border-t border-red-200">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
        <p class="mt-8 text-center text-xs text-gray-500">
          &copy; {{ new Date().getFullYear() }} {{ config.appName }} | Version {{ config.appVersion }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
import Logo from '../../../../components/u_i/sf_logo.vue';
  
  export default {
    components: { Logo },
    props: ['email', 'password', 'showPassword', 'isLoggingIn', 'error', 'config'],
    emits: ['update:email', 'update:password', 'toggle-password', 'submit'],
  }
  </script>