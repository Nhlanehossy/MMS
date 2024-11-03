<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <a-card class="max-w-md w-full">
      <div class="text-center mb-8">
        <Logo class="mx-auto h-12 w-auto" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Sign in</h2>
      </div>
      <a-form layout="vertical" @finish="$emit('submit')">
        <a-form-item>
          <a-input
            v-model:value="email"
            placeholder="Email address"
            type="email"
            size="large"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="password"
            placeholder="Password"
            size="large"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <button
           
            class="btn"
            type="submit"
            :loading="isLoggingIn"
            block
            size="large"
          >
            {{ isLoggingIn ? 'Signing in...' : 'Sign in' }}
          </button>
        </a-form-item>
      </a-form>
      <div class="flex justify-between items-center mb-4">
        <a-checkbox>Remember me</a-checkbox>
        <a class="text-secondary ">Forgot password?</a>
      </div>
      <a-divider>Or</a-divider>
      <div class="space-y-2">
        <a-button block size="large" icon="google" @click="handleGoogleLogin">
          Sign in with Google
        </a-button>
        <a-button block size="large" icon="facebook" @click="handleFacebookLogin">
          Sign in with Facebook
        </a-button>
      </div>
      <a-alert
        v-if="error"
        class="mt-4"
        type="error"
        :message="error"
        show-icon
      />
    </a-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Logo from "@/components/u_i/sf_logo.vue";

export default defineComponent({
  components: {
    Logo,
    UserOutlined,
    LockOutlined,
  },
  props: ['email', 'password', 'isLoggingIn', 'error', 'config'],
  emits: ['update:email', 'update:password', 'submit'],
  setup(props, { emit }) {
    const handleGoogleLogin = () => {
      // Implement Google login logic here
      console.log('Google login clicked');
    };

    const handleFacebookLogin = () => {
      // Implement Facebook login logic here
      console.log('Facebook login clicked');
    };

    return {
      handleGoogleLogin,
      handleFacebookLogin,
    };
  },
});
</script>

<style scoped>
.ant-divider-inner-text {
  font-size: 14px;
  color: #8c8c8c;
}
</style>