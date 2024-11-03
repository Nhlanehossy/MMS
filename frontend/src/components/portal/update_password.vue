<template>
    <div class="card  w-[95vw] lg:w-[100%]  rounded-lg px-6 sm:p-8 lg:px-10">
      <div class="">
     
        <form @submit.prevent="updatePassword">
          <div class="mb-4">
            <label for="currentPassword" class="block mb-2">{{ translationKeys.CurrentPassword }}</label>
            <input type="password" class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" id="currentPassword" v-model="currentPassword"  required>
          </div>
          <div class="mb-4">
            <label for="newPassword" class="block mb-2">{{ translationKeys.NewPassword }}</label>
            <input  class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" type="password" id="newPassword" v-model="newPassword"  required>
          </div>
          <div class="mb-6">
            <label for="confirmPassword" class="block mb-2">{{ translationKeys.ConfirmNewPassword }}</label>
            <input type="password" class="w-full px-3 py-2 rounded-md bg-cardDark border border-textLighter" id="confirmPassword" v-model="confirmPassword"  required>
          </div>
          <div class="flex justify-start">
            <button  type="submit" class="bg-primary px-4 py-2 rounded-md">{{ translationKeys.UpdatePassword }}</button>
          </div>
        </form>
        <transition name="fade">
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
            {{ errorMessage }}
          </div>
        </transition>
        <transition name="fade">
          <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
            {{ successMessage }}
          </div>
        </transition>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { translationKeys } from '@/executables/translation';
  
  export default {
    data() {
      return {
        translationKeys: translationKeys,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        errorMessage: '',
        successMessage: ''
      };
    },
    methods: {
      async updatePassword() {
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = "Passwords do not match";
          this.clearMessages();
          return;
        }
  
        try {
          const userId = localStorage.getItem('userId');
          const response = await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/${userId}/updatePassword`, {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword
          });
          this.successMessage = response.data.message;
          this.clearFields();
        } catch (error) {
          this.errorMessage = error.response.data.message || 'Failed to update password';
          this.clearFields();
        }
      },
      clearFields() {
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => {
          this.errorMessage = '';
          this.successMessage = '';
        }, 5000); // Clear messages after 5 seconds
      }
    }
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  </style>
  