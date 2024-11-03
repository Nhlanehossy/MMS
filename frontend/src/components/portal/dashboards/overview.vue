<template>
    <div class="px-4">
      <div class="card">
        <objectrenderer :resource="path" :displayData="info" :layout="path.layout" :showActions="false" :showHeading="false"/>
      </div>

    </div>
  </template>
  
  <script>
  import { e_commerce_management_system } from '../../../modules/e_commerce_system/system';
  import objectrenderer from '../../Object/objectrenderer.vue';
  import QuickActions from './quick_actions.vue';
import QuickStats from './quick_stats.vue';
import { getFilteredResources } from "../../../executables/accessControl";
import { Resources as AllResources } from "../../../data/resources";
  import axios from 'axios';
  
  export default {
    components: {
      objectrenderer,
      QuickActions,
    QuickStats
    },
    data(){
      return{
        info:{},
        actions:[]
      }
    },
    computed: {
      id() {
        return this.$route.query.myParam
      },
  
      path() {
        const currentPath = window.location.pathname;
        const firstPathSegment = currentPath.split('/')[1];
        const resource = e_commerce_management_system.find(r => r.name === firstPathSegment)
        return resource;
      }
    },
    async mounted() {
     const res=   await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${this.path.name}/${this.id}`)
     console.log(res.data)
     this.info=res.data
    },
    async created() {
    try {
      const roleId = localStorage.getItem("role");
      try {
        // Fetch the user with their role
        this.user = await getUserWithRole(localStorage.getItem('userId'));

        // Fetch all resources based on roleId
        let allActions = await getFilteredResources(roleId);

        // Filter to include only actions where action.name === 'goToView'
        this.actions = allActions.filter(resource =>
          resource.actions.some(action => action.name === 'goToView')
        );

        console.log('Filtered Actions:', this.actions);
      } catch (error) {
        console.error('Error fetching actions:', error);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      this.user = {
        _id: "123",
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
  }
  
  
  </script>