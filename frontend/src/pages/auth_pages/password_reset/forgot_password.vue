<!-- ForgotPassword.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <a-card class="max-w-md bg-menubg w-full">
        <div class="text-center mb-8">
          <Logo class="mx-auto h-12 w-auto" />
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Forgot Password</h2>
          <p class="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <a-form layout="vertical" @finish="handleSubmit">
          <a-form-item
            name="email"
            :rules="[{ required: true, type: 'email', message: 'Please input a valid email address' }]"
          >
            <a-input
              v-model:value="email"
              size="large"
              placeholder="Email address"
            >
              <template #prefix>
                <mail-outlined class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="isSubmitting"
              block
              size="large"
              class="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Reset Link' }}
            </a-button>
          </a-form-item>
        </a-form>
        <div class="text-center mt-4">
          <a-button type="link" @click="$router.push('/login')" class="text-blue-600 hover:text-blue-500">
            Back to Login
          </a-button>
        </div>
        <a-alert
          v-if="message"
          class="mt-4"
          :type="message.type"
          :message="message.content"
          show-icon
        />
      </a-card>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import { MailOutlined } from '@ant-design/icons-vue';
  import Logo from "@/components/u_i/sf_logo.vue";
  
  export default defineComponent({
    components: {
      Logo,
      MailOutlined,
    },
    setup() {
      const email = ref('');
      const isSubmitting = ref(false);
      const message = ref(null);
  
      const handleSubmit = async () => {
        isSubmitting.value = true;
        // Implement your forgot password logic here
        // For example:
        // try {
        //   await sendResetLink(email.value);
        //   message.value = { type: 'success', content: 'Reset link sent. Please check your email.' };
        // } catch (error) {
        //   message.value = { type: 'error', content: error.message };
        // }
        isSubmitting.value = false;
      };
  
      return {
        email,
        isSubmitting,
        message,
        handleSubmit,
      };
    },
  });
  </script>