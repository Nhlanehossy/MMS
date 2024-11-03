<template>
    <LoaderAlt v-if="loading" />
    <div v-else>
      <slot :data="data" :error="error"></slot>
    </div>
  </template>
  
  <script>
import LoaderAlt from "./u_i/sf_loader_alt.vue";
  import axios from "axios";
  
  export default {
    components: {
      LoaderAlt,
    },
    props: {
      resource: {
        type: String,
        required: true,
      },
      resourceId: {
        // New prop for the resource ID
        type: [String, Number],
        required: true,
      },
    },
    data() {
      return {
        loading: false,
        data: null,
        error: null,
      };
    },
    mounted() {
      this.fetchDataById(); // Changed method call to fetchDataById
    },
    methods: {
      async fetchDataById() {
        this.loading = true;
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource}/${this.resourceId}` // Changed URL to include resource ID
          );
          this.data = response.data;
          console.log('from single data  fetcher', response.data);
        } catch (err) {
          this.error = err;
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  