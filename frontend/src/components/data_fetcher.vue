<template>
    <LoaderAlt v-if="loading && LoaderAlt" />
    <Loader v-else-if="loading && !LoaderAlt" />
    <div v-else>
      <slot :data="data" :error="error" :pagination="pagination"></slot>
    </div>
  </template>
  
  <script>
  import Loader from "./u_i/sf_loader.vue";
  import LoaderAlt from "./u_i/sf_loader_alt.vue";
  import axios from "axios";
  
  export default {
    components: {
        
      LoaderAlt,
      Loader
    },
    props: {
      resource: {
        type: String,
        required: true,
      },
      requestType: {
        type: String,
        default: 'getResources',
        validator: (value) => ['getResources', 'filterByTime', 'fieldOcurrences', 'calculate', 'count', 'getById', 'search', 'sort', 'forecast'].includes(value)
      },
      params: {
        type: Object,
        default: () => ({})
      },
      LoaderAlt: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        loading: false,
        data: null,
        error: null,
        pagination: null,
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          let url = `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource}`;
          let params = { ...this.params };
  
          switch (this.requestType) {
            case 'getResources':
              // Params: returnFields, page, limit, sortBy, order, search
              break;
            case 'filterByTime':
              url += '/filterByTime';
              // Params: startTime, endTime
              break;
            case 'fieldOcurrences':
              url += '/fieldOcurrences';
              // Params: fieldName
              break;
            case 'calculate':
              url += '/calculate';
              // Params: fieldName, method, qFeild, qValue
              break;
            case 'count':
              url += '/count';
              break;
            case 'getById':
              url += '/get-by-id';
              // Params: field, id
              break;
            case 'search':
              url += '/search';
              // Params: (search query parameters)
              break;
            case 'sort':
              url += '/sort';
              // Params: (sorting parameters)
              break;
            case 'forecast':
              url = `${import.meta.env.VITE_APP_API_URL}/api/v1/forecast`;
              // Params: location
              break;
          }
  
          const response = await axios.get(url, { params });
          
          if (response.data.pagination) {
            this.pagination = response.data.pagination;
          }
          
          this.data = response.data.data || response.data.result || response.data.occurrences || response.data;
          console.log('Data fetched:', this.data);
        } catch (err) {
          this.error = err;
          console.error('Error fetching data:', err);
        } finally {
          this.loading = false;
        }
      },
    },
    watch: {
      params: {
        handler() {
          this.fetchData();
        },
        deep: true
      },
      requestType() {
        this.fetchData();
      }
    }
  };
  </script>