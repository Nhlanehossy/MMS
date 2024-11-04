<template>
  <div class="min-h-screen bg-cardDark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center"> <!-- Added text-center for centralizing content -->

      <div class="card flex flex-col justify-center">
      <Logo class="mx-auto h-12 w-auto" />
        <h2 class="mt-24 text-xl text-text">
          Sign in to your account
        </h2>
     
      <form class="mt-8 space-y-6" @submit.prevent="$emit('submit')">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserOutlined class="h-5 w-5 text-gray-400" />
              </div>
              <input id="email-address" name="email" type="email" :value="email"
                @input="$emit('update:email', $event.target.value)" required
                class="appearance-none bg-cardLight rounded-none relative block w-full px-3 py-2 pl-10 border border-textLighter placeholder-gray-500 text-textLighter rounded-t-md focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Email address" />
            </div>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockOutlined class="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" name="password" :type="showPassword ? 'text' : 'password'" :value="password"
                @input="$emit('update:password', $event.target.value)" required
                class="appearance-none bg-cardLight rounded-none relative block w-full px-3 py-2 pl-10 border border-textLighter placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none  focus:z-10 sm:text-sm"
                placeholder="Password" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" @click="$emit('toggle-password')"
                  class="text-gray-400 hover:text-textLight focus:outline-none">
                  <EyeOutlined v-if="showPassword" class="h-5 w-5" />
                  <EyeInvisibleOutlined v-else class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <!-- <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
            <label for="remember-me" class="ml-2 block text-sm text-text">
              Remember me
            </label>
          </div> -->
          <!-- <div class="text-sm">
            <a href="#" class="font-medium text-text hover:text-text">
              Forgot your password?
            </a>
          </div>-->
        </div> 
        <div>
          <button type="submit" :disabled="isLoggingIn"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-webSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="pi pi-lock"></i>
            </span>
            {{ isLoggingIn ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      <!-- <p v-if="error" class="mt-2 text-center text-sm text-red-600">
        {{ error }}
      </p>
      <p class="mt-2 text-center text-sm text-gray-600">
        Don't have an account? 
        <a href="/register" class="font-medium text-primary hover:text-webSecondary">Sign up</a> <!-- Added Sign Up link -->
      

    </div>
    </div>
  </div>
</template>

<script>
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';

import Logo from "@/components/u_i/sf_logo.vue";

export default {
  components: {
    Logo,
    UserOutlined,
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,

  },
  props: ['email', 'password', 'showPassword', 'isLoggingIn', 'error', 'config'],
  emits: ['update:email', 'update:password', 'toggle-password', 'submit', 'social-login'],
}
</script>
