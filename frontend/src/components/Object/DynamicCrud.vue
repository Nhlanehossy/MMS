<template>
    <a-card class="resource-listing mx-5">
        <!-- Loading State with Skeletons -->
        <template v-if="loading">
            <!-- Header Skeleton -->
            <a-row class="mb-4 flex justify-between">
                <a-row class="mb-4">
                    <a-col :span="24">
                        <a-space>
                            <a-skeleton active :paragraph="{ rows: 0 }" size="default" />
                            <a-skeleton active :paragraph="{ rows: 0 }" size="default" style="width: 200px;" />
                        </a-space>
                    </a-col>
                </a-row>
                <a-row>
                    <a-skeleton active size="default" :paragraph="{ rows: 0 }" style="width: 100px;" />
                </a-row>
            </a-row>

            <!-- Content Skeleton -->
            <template v-if="viewMode === 'list'">
                <div v-for="i in 3" :key="i">
                    <a-skeleton active :paragraph="{ rows: 4 }" />
                </div>
            </template>
            <a-row v-else :gutter="[16, 16]">
                <a-col v-for="i in 6" :key="i" :xs="24" :sm="12" :md="8">
                    <div class="card">
                        <a-skeleton active :paragraph="{ rows: 3 }" />
                    </div>
                </a-col>
            </a-row>

            <!-- Pagination Skeleton -->
            <a-row class="mt-4">
                <a-col :span="24">

                    <a-skeleton.button active style="width: 300px;" />
                </a-col>
            </a-row>
        </template>

        <!-- Main Content -->
        <template v-else>
            <template v-if="error">
                <a-result status="error" :title="error">
                    <template #extra>
                        <a-button type="primary" @click="fetchItems">Retry</a-button>
                    </template>
                </a-result>
            </template>
            <template v-else>
                <a-row class="mb-4 flex justify-between">
                    <a-row class="mb-4">
                        <a-col :span="24">
                            <a-space>
                                     <a-input-search v-model:value="searchQuery" placeholder="Search..."
                                    @search="performSearch" style="width: 200px;" />
                            </a-space>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-radio-group v-model:value="viewMode" button-style="solid">
                            <a-radio-button class="bg-cardDark border" value="grid">
                                <i class="pi pi-th-large"></i>
                            </a-radio-button>
                            <a-radio-button class="bg-cardDark border" value="list">
                                <i class="pi pi-list"></i>
                            </a-radio-button>
                        </a-radio-group>
                    </a-row>
                </a-row>

                <a-empty v-if="displayItems.length === 0" >
    <template #description>
      <span>
        No {{ resource.label }} records found.
     
      </span>
    </template>
    <button class="bg-primary px-4 py-2 rounded-md text-text" @click="addNewItem()"><i class="pi pi-plus mr-2"></i> Create Now</button>
  </a-empty>



                
                <template v-else>
                    <a-list v-if="viewMode === 'list'" :data-source="displayItems" :bordered="true">
                        <template #renderItem="{ item }">
                            <div class="bg-cardLight p-3 border border-textLighter first:rounded-t-lg last:rounded-b-lg">
                                <objectrenderer :resource="resource" :display-data="item" :layout="finalLayout"
                                    default-orientation="dropdown" :show-heading="false" />
                            </div>

                        </template>
                    </a-list>
                    <a-row v-else :gutter="[16, 16]">
                        <div @click="addNewItem()"
                            class="flex items-center justify-center border-dashed border-2 border-text rounded-md  m-0 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out flex-1">
                            <i class="pi pi-plus mr-2 text-gray-600"></i>
                            <span class=" mr-2">Add New </span>{{ resource.name }}
                        </div>
                        <a-col v-for="item in displayItems" :key="item.id" :xs="24" :sm="12" :md="8">
                            <div class="bg-cardLight p-3 border border-textLighter rounded-lg">
                                <objectrenderer :resource="resource" :display-data="item" :layout="finalLayout"
                                    default-orientation="icons" :show-heading="false" />
                            </div>
                        </a-col>

                    </a-row>
                </template>

                <a-row class="mt-4" v-if="showPagination">
                    <a-col :span="24">
                        <a-pagination v-model:current="currentPage" :total="totalCount" :pageSize="pageSize"
                            @change="handlePageChange" show-size-changer @showSizeChange="handlePageSizeChange"
                            show-total />
                    </a-col>
                </a-row>
            </template>
        </template>

        <!-- Add/Edit Drawer -->
        <a-drawer :visible="isDrawerVisible" placement="right" :width="480" @close="hideDrawer"
            :body-style="{ paddingBottom: '80px' }">
            <template #title>
                {{ drawerTitle }}
            </template>
            <multi_step_form :schema="resource.schema" :steps="[]" :initial-data="currentItem"
                :is-adding="!currentItem.id" :loading="formLoading" mode="default" @submit="handleFormSubmit" />
        </a-drawer>

        <a-drawer :visible="isEditDrawerOpen" placement="right" :width="480" @close="hideEditDrawer"
            :body-style="{ paddingBottom: '80px' }">
            <h1>Edit</h1>
        </a-drawer>
    </a-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import objectrenderer from './objectrenderer.vue';
import multi_step_form from '../dynamic_form_alt/multi_step_form.vue';
import { message, notification } from 'ant-design-vue';
import { mapState, mapActions } from 'vuex';
import {
    PlusOutlined,
    SearchOutlined,
    AppstoreOutlined,
    BarsOutlined,
    FilterOutlined,
} from '@ant-design/icons-vue';

export default defineComponent({
    name: 'ResourceListing',

    components: {
        objectrenderer,
        multi_step_form,
        PlusOutlined,
        SearchOutlined,
        AppstoreOutlined,
        BarsOutlined,
        FilterOutlined,
    },

    props: {
        resource: {
            type: Object,
            required: true,
            validator(value) {
                return value.name && value.schema && value.label;
            }
        },
        layout: {
            type: Object,
            required: false,
            default: () => null
        },
        staticData: {
            type: Array,
            default: () => null
        },
        useStaticData: {
            type: Boolean,
            default: false
        },
        presetFilters: {
            type: Object,
            default: () => ({})
        },
        presetIdFilters: {
            type: Object,
            default: () => ({})
        },
        defaultSortField: {
            type: String,
            default: 'updatedAt'
        },
        defaultSortOrder: {
            type: String,
            default: 'desc'
        },
        showPagination: {
            type: Boolean,
            default: true
        },
        defaultPageSize: {
            type: Number,
            default: 5
        }
    },

    computed: {
        ...mapState('editDrawer', ['isEditDrawerOpen']),

        displayItems() {
            if (this.useStaticData) {
                return this.processStaticData();
            }
            return this.items;
        }
    },

    methods: {
        ...mapActions('editDrawer', ['openEditDrawer', 'closeEditDrawer']),

        showEditDrawer(item = {}) {
            this.currentItem = { ...item };
            this.openEditDrawer();
        },

        hideEditDrawer() {
            this.closeEditDrawer();
            this.currentItem = {};
        },

        addNewItem() {
            this.$router.push({ path: `/dashboard/${this.resource.path}/item/add` });

        },
        processStaticData() {
            if (!this.staticData) return [];

            let processedData = [...this.staticData];

            // Apply filters
            processedData = this.applyFiltersToData(processedData);

            // Apply search
            if (this.searchQuery) {
                processedData = this.applySearchToData(processedData);
            }

            // Apply sorting
            processedData = this.applySortingToData(processedData);

            // Apply pagination
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;

            this.totalCount = processedData.length;
            return processedData.slice(start, end);
        },

        applyFiltersToData(data) {
            return data.filter(item => {
                let passes = true;

                // Apply preset filters
                for (const [key, value] of Object.entries(this.presetFilters)) {
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            passes = passes && value.includes(item[key]);
                        } else if (typeof value === 'object') {
                            // Handle operators like $gt, $lt, etc.
                            for (const [operator, operatorValue] of Object.entries(value)) {
                                switch (operator) {
                                    case '$gt':
                                        passes = passes && item[key] > operatorValue;
                                        break;
                                    case '$gte':
                                        passes = passes && item[key] >= operatorValue;
                                        break;
                                    case '$lt':
                                        passes = passes && item[key] < operatorValue;
                                        break;
                                    case '$lte':
                                        passes = passes && item[key] <= operatorValue;
                                        break;
                                    case '$ne':
                                        passes = passes && item[key] !== operatorValue;
                                        break;
                                    case '$in':
                                        passes = passes && operatorValue.includes(item[key]);
                                        break;
                                }
                            }
                        } else {
                            passes = passes && item[key] === value;
                        }
                    }
                }

                // Apply ID filters
                for (const [key, value] of Object.entries(this.presetIdFilters)) {
                    if (value) {
                        passes = passes && item[key] === value;
                    }
                }

                return passes;
            });
        },

        applySearchToData(data) {
            const searchLower = this.searchQuery.toLowerCase();
            return data.filter(item => {
                return Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchLower)
                );
            });
        },

        applySortingToData(data) {
            return [...data].sort((a, b) => {
                const aVal = a[this.sortBy];
                const bVal = b[this.sortBy];

                if (this.sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        }
    },

    setup(props, { emit }) {
        // State
        const items = ref([]);
        const loading = ref(false);
        const formLoading = ref(false);
        const error = ref(null);
        const viewMode = ref(localStorage.getItem(`${props.resource.name}_viewMode`) || 'grid');
        const isDrawerVisible = ref(false);
        const currentItem = ref({});
        const currentPage = ref(1);
        const pageSize = ref(props.defaultPageSize);
        const totalCount = ref(0);
        const searchQuery = ref('');
        const sortBy = ref(props.defaultSortField);
        const sortOrder = ref(props.defaultSortOrder);

        // Computed
        const finalLayout = computed(() => props.layout || generateLayout());
        const drawerTitle = computed(() => currentItem.value.id ? `Edit ${props.resource.label}` : `Add New ${props.resource.label}`);

        // Build API params
        const buildApiParams = () => {
            const params = {
                page: currentPage.value,
                limit: pageSize.value,
                sortBy: sortBy.value,
                order: sortOrder.value,
            };

            // Add search query
            if (searchQuery.value) {
                params.search = searchQuery.value;
            }

            // Add preset filters
            if (Object.keys(props.presetFilters).length > 0) {
                params.filter = {};
                for (const [key, value] of Object.entries(props.presetFilters)) {
                    if (value !== null && value !== undefined && value !== '') {
                        if (Array.isArray(value)) {
                            if (value.length > 0) {
                                params.filter[key] = { $in: value };
                            }
                        } else if (typeof value === 'object') {
                            params.filter[key] = value;
                        } else {
                            params.filter[key] = value;
                        }
                    }
                }
            }

            // Add ID filters
            if (Object.keys(props.presetIdFilters).length > 0) {
                params.idFilters = {};
                for (const [key, value] of Object.entries(props.presetIdFilters)) {
                    if (value) {
                        params.idFilters[key] = value;
                    }
                }
            }

            return params;
        };

        // API methods
        async function fetchItems() {
            if (props.useStaticData) {
                loading.value = false;
                return;
            }

            try {
                loading.value = true;
                const params = buildApiParams();

                const response = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/v1/${props.resource.name}`,
                    { params }
                );

                items.value = response.data.data;
                totalCount.value = response.data.pagination.totalCount;
                error.value = null;
            } catch (err) {
                error.value = 'Failed to fetch items';
                console.error('Fetch error:', err);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch items. Please try again.',
                });
            } finally {
                loading.value = false;
            }
        }

        // Event handlers
        function performSearch() {
            currentPage.value = 1;
            fetchItems();
        }

        function handlePageChange(page) {
            currentPage.value = page;
            fetchItems();
        }

        function handlePageSizeChange(current, size) {
            pageSize.value = size;
            currentPage.value = 1;
            fetchItems();
        }

        async function handleFormSubmit(formData) {
            if (props.useStaticData) {
                notification.warning({
                    message: 'Static Mode',
                    description: 'Cannot modify data in static mode.',
                });
                return;
            }

            formLoading.value = true;
            try {
                const url = `${import.meta.env.VITE_APP_API_URL}/api/v1/${props.resource.name}`;
                const method = currentItem.value.id ? 'put' : 'post';
                const endpoint = currentItem.value.id ? `${url}/${currentItem.value.id}` : url;

                await axios[method](endpoint, formData);
                hideDrawer();
                await fetchItems();

                notification.success({
                    message: 'Success',
                    description: `${props.resource.label} ${currentItem.value.id ? 'updated' : 'created'} successfully!`,
                });
            } catch (error) {
                console.error('Submission error:', error);
                notification.error({
                    message: 'Error',
                    description: error.response?.data?.message || 'Failed to submit data. Please try again.',
                });
            } finally {
                formLoading.value = false;
            }
        }

        function showDrawer(item = {}) {
            currentItem.value = { ...item };
            isDrawerVisible.value = true;
        }

        function hideDrawer() {
            isDrawerVisible.value = false;
            currentItem.value = {};
        }

        function generateLayout() {
            const fields = {};
            let row = 1;
            let col = 1;

            props.resource.schema.forEach((field) => {
                if (!field.hidden) {
                    fields[field.name] = {
                        rowStart: row,
                        colStart: col,
                        rowSpan: 1,
                        colSpan: 1,
                        alignment: field.alignment || 'top-left'
                    };

                    col++;
                    if (col > 2) {
                        col = 1;
                        row++;
                    }
                }
            });

            return {
                rows: Math.ceil(Object.keys(fields).length / 2),
                columns: 2,
                fields: fields
            };
        }

        // Watchers
        watch(viewMode, (newValue) => {
            localStorage.setItem(`${props.resource.name}_viewMode`, newValue);
        });

        watch(() => props.presetFilters, () => {
            currentPage.value = 1;
            fetchItems();
        }, { deep: true });

        watch(() => props.presetIdFilters, () => {
            currentPage.value = 1;
            fetchItems();
        }, { deep: true });

        // Initialize
        onMounted(() => {
            fetchItems();
        });

        return {
            // State
            items,
            loading,
            formLoading,
            error,
            viewMode,
            isDrawerVisible,
            currentItem,
            currentPage,
            pageSize,
            totalCount,
            sortBy,
            sortOrder,
            searchQuery,

            // Computed
            finalLayout,
            drawerTitle,

            // Methods
            fetchItems,
            showDrawer,
            hideDrawer,
            performSearch,
            handleFormSubmit,
            handlePageChange,
            handlePageSizeChange,
        };
    },
});
</script>

<style scoped>
.resource-listing {
    margin-bottom: 24px;
    border: 0;
}

.card {
    background: var(--card-background-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 16px;
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

/* Responsive styles */
@media (max-width: 768px) {
    .resource-listing {
        margin-bottom: 16px;
    }

    .card {
        padding: 12px;
    }
}
</style>