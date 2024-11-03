<!-- PasswordReset.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <a-card class="max-w-md w-full">
        <div class="text-center mb-8">
          <Logo class="mx-auto h-12 w-auto" />
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p class="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <a-form layout="vertical" @finish="handleSubmit">
          <a-form-item
            name="password"
            :rules="[{ required: true, message: 'Please input your new password' }]"
          >
            <a-input-password
              v-model:value="password"
              size="large"
              placeholder="New password"
            >
              <template #prefix>
                <lock-outlined class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            name="confirmPassword"
            :rules="[
              { required: true, message: 'Please confirm your new password' },
              { validator: validateConfirmPassword }
            ]"
          >
            <a-input-password
              v-model:value="confirmPassword"
              size="large"
              placeholder="Confirm new password"
            >
              <template #prefix>
                <lock-outlined class="text-gray-400" />
              </template>
            </a-input-password>
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
              {{ isSubmitting ? 'Resetting...' : 'Reset Password' }}
            </a-button>
          </a-form-item>
        </a-form>
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
  import { LockOutlined } from '@ant-design/icons-vue';
  import Logo from "@/components/u_i/sf_logo.vue";
  
  export default defineComponent({
    components: {
      Logo,
      LockOutlined,
    },
    setup() {
      const password = ref('');
      const confirmPassword = ref('');
      const isSubmitting = ref(false);
      const message = ref(null);
  
      const validateConfirmPassword = (rule, value) => {
        if (value !== password.value) {
          return Promise.reject('The two passwords do not match');
        }
        return Promise.resolve();
      };
  
      const handleSubmit = async () => {
        isSubmitting.value = true;
        // Implement your password reset logic here
        // For example:
        // try {
        //   await resetPassword(password.value);
        //   message.value = { type: 'success', content: 'Password reset successfully. You can now log in with your new password.' };
        // } catch (error) {
        //   message.value = { type: 'error', content: error.message };
        // }
        isSubmitting.value = false;
      };
  
      return {
        password,
        confirmPassword,
        isSubmitting,
        message,
        validateConfirmPassword,
        handleSubmit,
      };
    },
  });
  </script>