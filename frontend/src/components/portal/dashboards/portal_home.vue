<template>
    <div class="">
      <div v-if="user" class="w-full p-4">
        <QuickActions :actions="actions" :limit="20" />
      </div>  
      <div v-else class="text-gray-500">
        <Loader />
      </div>
    </div>
  </template>
  
  <script>
  import { getUserWithRole } from '../../../executables/getSanitizedUser';
  import QuickActions from './quick_actions.vue';
  import { getFilteredResources } from "../../../executables/accessControl";
  import {Resources as AllResources} from "../../data/Resources";
  import Loader from '../../components/LoaderAlt.vue';
  
  export default {
    name: 'Home',
    components: {
      QuickActions,
      Loader
    },
    data() {
      return {
        user: null,
        actions: []
      };
    },
    async created() {
      try {
        const roleId = localStorage.getItem("role");
        this.user = await getUserWithRole(localStorage.getItem('userId'))
        this.actions = await getFilteredResources(roleId)
        console.log('Fetched Resources:', this.actions);
      } catch (error) {
        console.error('Error fetching user:', error);
        this.user={
          _id:"123",
          fullname: "John Doe",
          username: "john",
          email: "qRb2K@example.com",
          role: "admin",
          phoneNumber: "1234567890",
          undefined: "https://via.placeholder.com/150"
        };
  
        this.actions = AllResources
      }
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional custom styles here */
  </style>
  