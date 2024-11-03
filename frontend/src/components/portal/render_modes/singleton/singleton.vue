j<template>
  <div v-if="loading">
    <LoaderAlt />
  </div>
  <div v-else>

    <div class=" m-2 lg:m-5">
      <h2 class="heading">{{ resource.label }}</h2>
      <DynamicForm
        :resource="resource"
        :initial-data="object"
        :is-adding="isAdding"
        redirectTo="current"
        class="p-4 shadow-md rounded-md"
      />
        </div>
    </div>
</template>

<script>
import DynamicForm from "../crud/dynamic_form.vue";
import LoaderAlt from "../../../u_i/sf_loader_alt.vue";
import axios from "axios";
import UpdatePassword from "../../update_password.vue";

export default {
  components: { DynamicForm, LoaderAlt, UpdatePassword },
  data() {
    return {
      loading: false,
      object: null,
      isAdding: true,
    };
  },
  created() {
    this.fetchResource();
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  watch: {
    resource: {
      handler() {
        this.fetchResource();
      },
      deep: true,
    },

  },
  methods: {
    refreshWindow() {
      window.location.reload();
    },
    fetchResource() {
      this.loading = true;
      const id = localStorage.getItem("userId");

      if (this.resource.singletonType == "profile") {
        this.isAdding = false;
        axios
          .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/${id}`)
          .then((response) => {
            this.object = response.data;
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error fetching resource:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        axios
          .get(
            `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}`
          )
          .then((response) => {
            if (response.data.data.length > 0) {
              this.isAdding = false;
              this.object = response.data.data[0];
            } else {
              this.isAdding = true;
              this.object = {};
            }
          })
          .catch((error) => {
            console.error("Error fetching resource:", error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>
