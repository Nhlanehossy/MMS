<template>
  <div v-if="loading">
    <LoaderAlt />
  </div>
  <div v-else>
    <div class="container mx-auto p-2 lg:p-4">
      <div class="my-6">
        <div class="flex items-center justify-between">
          <h5>
            <i :class="resource.icon">&nbsp;</i>{{ resource.label }}
            | <span>&nbsp;{{ totalCount }} {{ translationKeys.Records }}</span>
          </h5>
          <div>
            <Pagination 
              :currentPage="Number($route.query.page) || 1" 
              :totalPages="totalPages" 
              @prev-page="prevPage"
              @next-page="nextPage" />
          </div>
        </div>



<div class="p-4">
  <div class="flex flex-wrap gap-3 items-center">
    <!-- Left Section: Primary Actions -->
    <div class="flex flex-wrap items-center gap-2 md:mr-4">
      <button class="btn-primary flex items-center" @click="addItemToResource">
        <i class="fas fa-plus text-xs mr-1.5"></i>
        {{`${translationKeys.Create} ${resource.label}`}}
      </button>
      
      <button class="btn-secondary flex items-center" @click="fetchResource">
        <i class="fas fa-sync-alt text-xs mr-1.5"></i>
        {{ translationKeys.Refresh }}
      </button>
    </div>

    <!-- Middle Section: Selection and Bulk Actions -->
    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          v-model="selectAll" 
          @change="toggleSelectAll"
          class="mr-1.5">
        <span class="text-sm">{{ translationKeys.SelectAll }}</span>
      </label>

      <div class="flex gap-2" v-if="selectedRows.length > 0">
        <button 
          class="btn-danger btn-sm flex items-center" 
          @click="showBulkDeleteConfirmation">
          <i class="fas fa-trash text-xs mr-1.5"></i>
          {{ translationKeys.BulkDelete }}
        </button>

        <button 
          v-if="checkRef()" 
          class="btn-warning btn-sm flex items-center"
          @click="toggleBulkUpdateDrawer">
          <i class="fas fa-edit text-xs mr-1.5"></i>
          {{ translationKeys.BulkUpdate }}
        </button>
      </div>
    </div>

    <!-- Right Section: Controls -->
    <div class="flex flex-wrap items-center gap-3 ml-auto">
      <div class="flex items-center gap-2">
        <label class="text-sm" for="itemsPerPage">Per Page:</label>
        <select 
          v-model="itemsPerPage" 
          id="itemsPerPage"
          class="select-sm min-w-[70px]">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm" for="sortOrder">Sort:</label>
        <select 
          v-model="sortOrder" 
          id="sortOrder"
          class="select-sm min-w-[100px]">
          <option value="asc">{{ translationKeys.Ascending }}</option>
          <option value="desc">{{ translationKeys.Descending }}</option>
        </select>
      </div>

      <select 
        v-model="selectedAction" 
        @change="performAction"
        class="select-sm min-w-[100px]">
        <option value="" disabled>{{ translationKeys.Actions }}</option>
        <option value="exportCSV">{{ translationKeys.ExportCSV }}</option>
      </select>
    </div>
  </div>

  <!-- Filter Section -->
  <div 
    v-if="checkRef()" 
    class="mt-4 p-3 bg-gray-50 rounded-lg">
    <div class="flex flex-wrap items-center gap-3">
      <label class="flex items-center text-sm font-medium">
        <i class="fa fa-filter mr-1.5"></i>
        {{ translationKeys.Filter }}
      </label>
      
      <div class="flex-1 flex items-center gap-2">
        <DynamicFormEmbedable
          :resource="sanitizedResource"
          :initialData="{}"
          :returnDataOnly="true"
          @form-data="applyFilters" />
        
        <button 
          class="btn-text btn-sm"
          @click="clearFilters">
          {{ translationKeys.Reset }}
        </button>
      </div>
    </div>
  </div>
</div>



      </div>
      <div v-if="loading" class="flex justify-center items-center h-screen">
        <Loader />
      </div>
      <div v-else>
        <DynamicTable 
          :resource="resource" 
          :items="FilteredData" 
          :objectFilters="objectFilters" 
          :selectedRows="selectedRows"
          @update:selectedRows="updateSelectedRows" />
      </div>

      <!-- Hidden download-csv component -->
      <download-csv 
        :data="sanitizedData" 
        :name="`${resource.name}_${new Date().toISOString().replace(/[:.-]/g, '')}.csv`"
        ref="csvDownloader">
        <span style="display: none;">{{ translationKeys.DownloadCSV }}</span>
      </download-csv>

      <!-- Confirmation Modal -->
      <Modal ref="confirmModal" @confirm="confirmBulkDelete" @cancel="cancelBulkDelete">
        <template #header>{{ translationKeys.ConfirmBulkDelete }}</template>
        <template #body>
          <p>{{ translationKeys.ConfirmBulkDeleteMessage }}</p>
        </template>
      </Modal>

      <!-- Filter Drawer -->
      <transition name="slide-fade">
        <div v-if="showFilterDrawer" class="fixed inset-y-0 right-0 w-96 z-50 overflow-y-auto">
          <div>
            <div>
              <h2>Filter {{ resource.label }}</h2>
              <button @click="toggleFilterDrawer">
                <i class="fas fa-times fa-lg"></i>
              </button>
            </div>
            <DynamicForm 
              :resource="sanitizedResource" 
              :initialData="{}" 
              :returnDataOnly="true"
              @form-data="applyFilters" />
          </div>
        </div>
      </transition>

      <!-- Bulk Update Drawer -->
      <transition name="slide-fade">
        <div v-if="showBulkUpdateDrawer" class="fixed inset-y-0 right-0 w-96 z-50 overflow-y-auto">
          <div>
            <div>
              <h2>{{`${translationKeys.BulkUpdate} ${resource.label}` }}</h2>
              <button @click="toggleBulkUpdateDrawer">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <!-- Add bulk update form or component here -->
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { translationKeys } from '@/executables/translation';
import Loader from "../../../u_i/sf_loader.vue";
import LoaderAlt from "../../../u_i/sf_loader_alt.vue";
import DynamicTable from "./crud_view_renderer.vue";
import Pagination from "./pagination.vue";
import DynamicForm from "./dynamic_form.vue";
import Swal from "sweetalert2";
import { ref } from 'vue';
import DynamicFormEmbedable from "./embedable_dynamic_form.vue";
import Filterdata from "../../../../executables/Filterdata";
import sanitizeData from "../../../../executables/sanitizeData";
import OverviewModal from "./overview_modal.vue";


export default {
  components: { Loader, DynamicTable, Pagination, LoaderAlt, DynamicForm, DynamicFormEmbedable, OverviewModal },
  setup() {
    const csvDownloader = ref(null);
    return { csvDownloader };
  },
  data() {
    return {
      loading: false,
      translationKeys: translationKeys,
      sanitizedJson: {},
      sanitizedData: [],
      FilteredData: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 10,
      totalPages: 0,
      totalCount: 0,
      sortBy: "",
      sortOrder: "asc",
      status: "",
      modalRef: null,
      selectedRows: [],
      selectAll: false,
      selectedBatchAction: "",
      selectedAction: "",
      showFilterDrawer: false,
      filters: {},
      sanitizedResource: {},
      showBulkUpdateDrawer: false,
      CanAdd: false,
      showFilterModal: false
    };
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
    resources: {
      type: Array,
      required: true,
    },
  },
  watch: {
    "resource.name": {
      async handler() {
        this.CanAdd = this.resource.actions.some(action => 'create' in action);
        this.sanitizedResource = this.sanitizeResourceSchema(this.resource);
        this.sanitizedData = await sanitizeData(this.FilteredData);
        this.FilteredData = await Filterdata(this.resources, this.resource, {...this.filters, ...this.objectFilters});
        this.fetchResource();
        this.selectAll = this.selectedRows.length === this.resources.length;
      },
    },
    searchQuery() {
      this.currentPage = 1;
      this.fetchResource();
    },
    sortBy() {
      this.currentPage = 1;
      this.fetchResource();
    },
    sortOrder() {
      this.currentPage = 1;
      this.fetchResource();
    },
    status() {
      this.currentPage = 1;
      this.fetchResource();
    },
    itemsPerPage() {
      this.currentPage = 1;
      this.fetchResource();
    },
  },
  async mounted() {
    this.CanAdd = this.resource.actions.some(action => 'create' in action);
    this.sanitizedResource = this.sanitizeResourceSchema(this.resource);
    this.modalRef = this.$refs.modalRef;
    this.updateStateFromURL();
    this.$watch(
      () => this.$route.query,
      () => {
        this.updateStateFromURL();
      },
      { deep: true }
    );
    this.fetchResource();
    console.log('ccccccccccccccccccccccccccccccc', this.resources);

    console.log(this.sanitizedData);
  },
  methods: {
    toggleFilterDrawer() {
      this.showFilterDrawer = !this.showFilterDrawer;
    },

    checkRef() {
      return this.resource.schema.some(field => field.type === 'ref');
    },

    toggleBulkUpdateDrawer() {
      this.showBulkUpdateDrawer = !this.showBulkUpdateDrawer;
    },

    async applyBulkUpdate(updateData) {
      const sanitizedUpdateData = this.sanitizeObject(updateData);

      if (Object.keys(sanitizedUpdateData).length === 0) {
        Swal.fire('Error', 'No fields selected for update', 'error');
        return;
      }

      const bulkUpdatePayload = this.selectedRows.map(id => ({
        _id: id,
        ...sanitizedUpdateData
      }));

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.path}/bulkupdate`,
          bulkUpdatePayload
        );

        if (response.status === 200) {
          Swal.fire(translationKeys.Success, translationKeys.BulkUpdateSuccess, 'success');
          this.selectedRows = []; 
          this.selectAll = false; 
          this.fetchResource();
          this.toggleBulkUpdateDrawer();
        } else {
          throw new Error('Unexpected response status');
        }
      } catch (error) {
        console.error("Error performing bulk update:", error);
        Swal.fire(translationKeys.Error, translationKeys.BulkUpdateError, 'error');
      }
    },

    sanitizeObject(obj) {
      const sanitizedObj = {};

      Object.keys(obj).forEach(key => {
        const value = obj[key];

        if (value !== null && value !== "" &&
          !(typeof value === 'object' && Object.keys(value).length === 0)) {
          sanitizedObj[key] = value;
        }
      });

      return sanitizedObj;
    },

    sanitizeResourceSchema(resourceObject) {
      if (!resourceObject || !resourceObject.schema) {
        return resourceObject;
      }

      const sanitizedSchema = resourceObject.schema.filter(field =>
        ['ref','select', 'check'].includes(field.type))

      return {
        ...resourceObject,
        schema: sanitizedSchema
      };
    },

    async applyFilters(filterData) {

      this.loading = true;
      try {
        const sanitizedJson = this.sanitizeObject(filterData)
        console.log(this.resource.schema);
        console.log('sanitizedvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', {...sanitizedJson, ...this.objectFilters});
        this.filters = sanitizedJson;
        this.currentPage = 1;
        console.log(this.resources);
        this.FilteredData = await Filterdata(this.resources, this.resource, {...sanitizedJson, ...this.objectFilters});
      } catch (error) {
        console.error("Error fetching resource:", error);

      } finally {
        this.loading = false;
      }





    },


    updateStateFromURL() {
      this.currentPage = Number(this.$route.query.page) || 1;
      this.itemsPerPage = Number(this.$route.query.limit) || 30;
      this.searchQuery = this.$route.query.search || "";
      this.sortBy = this.$route.query.sortBy || "";
      this.sortOrder = this.$route.query.order || "asc";
      this.status = this.$route.query.status || "";
    },
    async fetchResource() {
      this.loading = true;
      try {

        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.name}`, {
          params: {
            returnFields: '',
            page: this.currentPage,
            limit: this.itemsPerPage,
            sortBy: this.sortBy,
            order: this.sortOrder,
            search: this.searchQuery,
            filter: this.filters,
            ...this.objectFilters,
          },
        })
    
        
        this.FilteredData = await Filterdata(response.data.data, this.resource, {...this.filters, ...this.objectFilters});
        this.sanitizedData = await sanitizeData(this.FilteredData);
        this.totalCount = response.data.pagination.totalCount;
        this.totalPages = response.data.pagination.totalPages;

      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        this.loading = false;
      }
    }
    ,
    async prevPage() {
      if (this.currentPage > 1) {
        await this.$router.push({
          query: {
            ...this.$route.query,
            page: this.currentPage - 1,
          },
        });
      }
      this.fetchResource();
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.$router.push({
          query: {
            ...this.$route.query,
            page: this.currentPage + 1,
          },
        });
      }
      this.fetchResource();
    },
    addItemToResource() {
      if (this.resource && this.resource.name) {
        const resourceName = this.resource.path;
        this.$router.push(`/dashboard/${resourceName}/item/add`);
      } else {
        console.warn("Resource is undefined or does not have a name property");
      }
    },
    async clearFilters() {
      this.$router.go(0);
    },
    exportToCSV() {
      if (this.$refs.csvDownloader) {
        this.$refs.csvDownloader.$el.click();
      }
    },
    performAction() {
      switch (this.selectedAction) {
        case "exportCSV":
          this.exportToCSV();
          break;
        case "clearFilters":
          this.clearFilters();
          break;
        case "refresh":
          this.fetchResource();
          break;
        case "bulkDelete":
          this.showBulkDeleteConfirmation();
          break;
      }
      this.selectedAction = ""; // Reset the dropdown
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedRows = this.resources.map(item => item.id);
      } else {
        this.selectedRows = [];
      }
    },
    updateSelectedRows(rows) {
      this.selectedRows = rows;
      this.selectAll = this.selectedRows.length === this.resources.length;
    },
    showBulkDeleteConfirmation() {
      Swal.fire({
        title: translationKeys.AreYouSure,
        text: translationKeys.DeleteWarning,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: translationKeys.YesDelete
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmBulkDelete();
        }
      });
    },
    async confirmBulkDelete() {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/api/v1/${this.resource.path}`, {
          data: this.selectedRows
        });
        this.fetchResource(); // Refresh the data
        this.selectedRows = []; // Clear selected rows
        this.selectAll = false; // Uncheck "Select All"
        Swal.fire(
          translationKeys.Deleted,
          translationKeys.DeleteSuccess,
          'success'
        );
      } catch (error) {
        console.error("Error performing bulk delete:", error);
        Swal.fire(
          translationKeys.Error,
          translationKeys.DeleteError,
          'error'
        );
      }
    },
    cancelBulkDelete() {
      this.selectedAction = "";
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
}

.slide-fade-enter-active {
  animation: slideFadeEnter 0.5s ease both;
}

.slide-fade-leave-active {
  animation: slideFadeLeave 0.5s ease both;
}

@keyframes slideFadeEnter {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFadeLeave {
  0% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.btn-primary {
  @apply bg-secondary hover:bg-tertiary text-textLight font-medium py-2 px-3 rounded transition duration-150 ease-in-out;
}

.btn-secondary {
  @apply bg-cardDark hover:bg-gray-700 text-text font-medium py-2 px-3 rounded transition duration-150 ease-in-out;
}

.form-select {
  @apply bg-cardLight border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary;
}

.form-checkbox {
  @apply rounded border-gray-300 text-secondary focus:ring-secondary;
}
</style>