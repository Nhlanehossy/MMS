<template>
  <LoaderAlt v-if="loading && LoaderAlt == true" />
  <Loader v-if="loading && LoaderAlt == false" />
  <div v-else>
    <slot :data="data" :error="error"></slot>
  </div>
</template>

<script>
import Loader from "./u_i/sf_loader.vue";
import LoaderAlt from "./u_i/sf_loader_alt.vue";
import axios from "axios";

export default {
  components: {
    LoaderAlt,
    Loader,
  },
  props: {
    resource: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    LoaderAlt: {
      type: Boolean,
      default: true,
      required: false,
    },
    filters: {  // Accept filters as a prop
      type: Object,
      default: () => ({}),
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
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource}`,
          {
            params: {
              limit: this.limit,
              ...this.filters,  // Spread filters into params
            },
          }
        );
        this.data = response.data.data;
        console.log('from data fetcher', response.data.data);
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
