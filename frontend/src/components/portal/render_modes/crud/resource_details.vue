<template>
  <div class="flex flex-col items-center justify-center h-full">

    <div class="w-[100%]  px-2 py-4 h-[100%] overflow-scroll rounded-lg  relative">

      <div v-if="loading" class="loader-container">
        <LoaderAlt />
      </div>

      <div v-else>

        <div class=" sm:w-full w-[18.7rem]" v-if="mode === 'add'">
          <span class="mt-2 p-2 w-9 flex cursor-pointer text-primary items-center mb-4" @click="this.$router.go(-1)">
                <i class="pi pi-arrow-left common-text"></i>&nbsp;BACK
          </span>
          <DynamicForm :resource="resource" :initial-data="inventoryItem" :is-adding="true" />
        </div>

        <div class=" sm:w-full w-[18.7rem]" v-else-if="mode === 'edit'">
          <div class="flex w-full justify-between">
              <span class="mt-2 p-2 flex justify-between cursor-pointer text-primary items-center mb-4" @click="this.$router.go(-1)">
                <i class="pi pi-arrow-left common-text"></i>&nbsp;BACK
              </span>
              <span class="mt-2 p-2 flex justify-between items-center mb-4">
              </span>
            </div>
          <DynamicForm :resource="resource" :initial-data="inventoryItem" :is-adding="false" redirect-to="prev" />
        </div>

        <div v-else-if="mode === 'object'">
          <ObjectRenderer />
        </div>

        <div v-else class="item-details sm:w-full w-[18.7rem]">
          <div class="flex flex-row-reverse items-center justify-between">
            <div class="mb-3 flex justify-between items-center">
              <!--cardLight
              <action_dispatcher :resource="resource" :item="inventoryItem" orientation="icons" />              
              -->
            </div>
            <div class="flex w-full justify-between">
              <span class="mt-2 p-2 flex justify-between cursor-pointer text-primary items-center mb-4" @click="this.$router.go(-1)">
                <i class="pi pi-arrow-left common-text"></i>&nbsp;BACK
              </span>
              <span class="mt-2 p-2 flex justify-between items-center mb-4" v-print="'#report'">
                <i class="pi pi-print"></i>
              </span>
            </div>
          </div>
          <DataRenderer :resource="resource" :initial-data="inventoryItem" :currentID="id" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Loader from "../../../u_i/sf_loader.vue";
import LoaderAlt from "../../../u_i/sf_loader_alt.vue";
import DynamicForm from "./dynamic_form.vue";
import DataRenderer from "./data_renderer/data_renderer.vue";
import { Resources } from "../../../../data/resources";
import { getDefaultValuesFromSchema } from "../../../../executables/getDefaultValues";
import action_dispatcher from "../../../action_dispatcher.vue";
import print from "vue3-print-nb";

export default {
  components: {
    Loader,
    LoaderAlt,
    DynamicForm,
    DataRenderer,
    action_dispatcher
  },
  directives: { print },
  data() {
    return {
      actionLoading: false,
      inventoryItem: {},
      loading: false,
      id: this.$route.params.id,
      mode: "",
      resourceName: "",
      resource: {},
      initialData: {},
    };
  },

  created() {


    const mode = this.$route.params.mode;
    const resourceName = this.$route.params.resourceName;
    this.resourceName = resourceName;
    this.resource = Resources.find((r) => r.path === resourceName);
    this.mode = mode;
    this.initialData = getDefaultValuesFromSchema(this.resource);
    console.log(this.initialData);

    if (mode === "add") {
      this.inventoryItem = {

      };
    } else {
      this.fetchInventoryItem();
    }
  },
  methods: {

    goBack() {
      this.$router.go(-1);
    },

    fetchInventoryItem() {
      this.loading = true;
      const itemId = this.$route.params.id;
      const mode = this.$route.params.mode;
      this.mode = mode;

      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}/${itemId}`)
        .then((response) => {
          this.inventoryItem = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching inventory item:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

  },
};
</script>
