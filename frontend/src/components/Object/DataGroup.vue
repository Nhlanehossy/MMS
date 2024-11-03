<template>
    <a-card class="resource-listing">
        <template v-if="loading">
            <!-- Skeleton Loading States -->
            <template v-if="displayMode === 'list'">
                <a-skeleton active :paragraph="{ rows: 5 }" v-for="i in 3" :key="i" class="mb-4" />
            </template>

            <template v-else-if="displayMode === 'grid'">
                <a-row :gutter="[16, 16]">
                    <a-col v-for="i in 6" :key="i" :xs="24" :sm="12" :md="8">
                        <a-skeleton active :paragraph="{ rows: 3 }" />
                    </a-col>
                </a-row>
            </template>

            <template v-else-if="displayMode === 'carousel'">
                <a-row :gutter="[16, 16]">
                    <a-col v-for="i in carouselItemsToShow" :key="i" :span="24 / carouselItemsToShow">
                        <a-skeleton active :paragraph="{ rows: 3 }" />
                    </a-col>
                </a-row>
            </template>
        </template>

        <template v-else>
            <template v-if="error">
                <a-result status="error" :title="error">
                    <template #extra>
                        <a-button type="primary" @click="fetchItems">Retry</a-button>
                    </template>
                </a-result>
            </template>
            <template v-else>
                <!-- Header Section -->
                <a-row class="mb-4 flex justify-between" v-if="showHeader || showMoreLink">
                    <a-col v-if="showHeader">
                        <h2 class="text-xl font-semibold">{{ headerTitle }}</h2>
                    </a-col>
                </a-row>

                <a-empty v-if="items.length === 0" />
                <template v-else>
                    <!-- List View -->
                    <a-list v-if="displayMode === 'list'" :data-source="limitedItems" :bordered="true">
                        <template #renderItem="{ item }">
                            <div class="bg-cardLight p-3 border border-textLighter rounded-lg">
                                <objectrenderer :resource="resource" :display-data="item" :layout="resource.layout"
                                    default-orientation="dropdown" :show-heading="false" />
                            </div>
                        </template>
                    </a-list>

                    <!-- Grid View -->
                    <a-row v-else-if="displayMode === 'grid'" :gutter="[16, 16]">
                        <a-col v-for="item in limitedItems" :key="item.id" :xs="24" :sm="12" :md="8">
                            <div class="bg-cardLight p-3 border border-textLighter rounded-lg">
                                <objectrenderer :resource="resource" :display-data="item" :layout="resource.layout"
                                    default-orientation="icons" :show-heading="false" />
                            </div>
                        </a-col>
                    </a-row>

                    <!-- Carousel View -->
                    <vue3-carousel v-else-if="displayMode === 'carousel'" :items-to-show="carouselItemsToShow"
                        :wrap-around="true" :touch-drag="true" :mouse-drag="true" :breakpoints="carouselBreakpoints">
                        <slide v-for="item in limitedItems" :key="item.id">
                            <div class="bg-cardLight p-3 border border-textLighter rounded-lg min-w-96">
                                <objectrenderer :resource="resource" :display-data="item" :layout="resource.layout"
                                    default-orientation="icons" :show-heading="false" />
                            </div>
                        </slide>

             

                        <template #addons>
                            <navigation />
                            <pagination />
                        </template>
                    </vue3-carousel>
                </template>
                <div class="mt-4 float-end">
                    <a-col v-if="showMoreLink">
                                <a-button type="link"
                                    :style="{ backgroundColor: 'var(--primary)', color: '#ffff', borderColor: 'var(--primary)' }"
                                    @click="onMoreClick">{{ moreLinkText }}</a-button>
                            </a-col>
                </div>
                <a-row class="mt-4" v-if="showPagination && totalCount > pageSize">
                    <a-col :span="24">
                        <a-pagination v-model:current="currentPage" :total="totalCount" :pageSize="pageSize"
                            @change="handlePageChange" :show-size-changer="showPageSizeChanger"
                            @showSizeChange="handlePageSizeChange" :show-total="showTotalItems" />
                    </a-col>
                </a-row>
            </template>
        </template>
    </a-card>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { notification } from 'ant-design-vue';
import { Carousel as vue3Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import objectrenderer from './objectrenderer.vue';
import 'vue3-carousel/dist/carousel.css';
import resource from '../../stores/modules/resource';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'CustomResourceListing',

    components: {
        objectrenderer,
        vue3Carousel,
        Slide,
        Pagination,
        Navigation
    },

    props: {
        resource: {
            type: Object,
            required: true,
            validator(value) {
                return value.name && value.schema && value.label;
            }
        },
        initialData: {
            type: Array,
            default: () => null
        },
        useApi: {
            type: Boolean,
            default: true
        },
        layout: {
            type: Object,
            required: false,
            default: () => null
        },
        displayMode: {
            type: String,
            default: 'list',
            validator: (value) => ['list', 'grid', 'carousel'].includes(value)
        },
        showPagination: {
            type: Boolean,
            default: true
        },
        showPageSizeChanger: {
            type: Boolean,
            default: true
        },
        showTotalItems: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        headerTitle: {
            type: String,
            default: 'Resources'
        },
        showMoreLink: {
            type: Boolean,
            default: false
        },
        moreLinkText: {
            type: String,
            default: 'See More'
        },
        defaultPageSize: {
            type: Number,
            default: 1000
        },
        maxDisplayItems: {
            type: Number,
            default: null
        },
        carouselItemsToShow: {
            type: Number,
            default: 3
        },
        presetFilters: {
            type: Object,
            default: () => ({})
        },
        presetIdFilters: {
            type: Object,
            default: () => ({})
        },
        searchQuery: {
            type: String,
            default: ''
        },
        sortField: {
            type: String,
            default: 'updatedAt'
        },
        sortOrder: {
            type: String,
            default: 'desc',
            validator: (value) => ['asc', 'desc'].includes(value)
        }
    },
    setup(props, { emit }) {
        const items = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const currentPage = ref(1);
        const pageSize = ref(props.defaultPageSize);
        const totalCount = ref(0);

        const router = useRouter();

        const carouselBreakpoints = {
            0: {
                itemsToShow: 1,
                snapAlign: 'center'
            },
            768: {
                itemsToShow: 2,
                snapAlign: 'center'
            },
            1024: {
                itemsToShow: props.carouselItemsToShow,
                snapAlign: 'center'
            }
        };

        const limitedItems = computed(() => {
            if (props.maxDisplayItems) {
                return items.value.slice(0, props.maxDisplayItems);
            }
            return items.value;
        });

        const finalLayout = computed(() => props.layout || generateLayout());

        const initializeData = () => {
            if (props.initialData && !props.useApi) {
                items.value = props.initialData;
                totalCount.value = props.initialData.length;
                loading.value = false;
                error.value = null;
                emit('fetch-success', {
                    items: items.value,
                    pagination: {
                        currentPage: currentPage.value,
                        pageSize: pageSize.value,
                        totalCount: totalCount.value
                    }
                });
            } else {
                fetchItems();
            }
        };

        const buildApiParams = () => {
            const params = {
                page: currentPage.value,
                limit: pageSize.value,
                sortBy: props.sortField,
                order: props.sortOrder
            };

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

            if (Object.keys(props.presetIdFilters).length > 0) {
                params.idFilters = {};
                for (const [key, value] of Object.entries(props.presetIdFilters)) {
                    if (value) {
                        params.idFilters[key] = value;
                    }
                }
            }

            if (props.searchQuery) {
                params.search = props.searchQuery;
            }

            return params;
        };

        async function fetchItems() {
            if (!props.useApi) return;

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

                emit('fetch-success', {
                    items: items.value,
                    pagination: response.data.pagination,
                    params
                });
            } catch (err) {
                error.value = 'Failed to fetch items';
                console.error('Fetch error:', err);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch items. Please try again.',
                });
                emit('fetch-error', err);
            } finally {
                loading.value = false;
            }
        }

        function handlePageChange(page) {
            currentPage.value = page;
            if (props.useApi) {
                fetchItems();
            } else {
                // Handle local pagination for initial data
                const startIndex = (page - 1) * pageSize.value;
                const endIndex = startIndex + pageSize.value;
                items.value = props.initialData.slice(startIndex, endIndex);
            }
            emit('page-change', page);
        }

        function handlePageSizeChange(current, size) {
            pageSize.value = size;
            currentPage.value = 1;
            if (props.useApi) {
                fetchItems();
            } else {
                // Handle local pagination for initial data
                items.value = props.initialData.slice(0, size);
            }
            emit('page-size-change', size);
        }

        function onMoreClick() {
            router.push({ path: `/dashboard/${props.resource.path}` });
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

        // Watch for changes in props
        watch(() => props.initialData, () => {
            if (!props.useApi && props.initialData) {
                initializeData();
            }
        }, { deep: true });

        watch(() => props.presetFilters, () => {
            if (props.useApi) {
                currentPage.value = 1;
                fetchItems();
            }
        }, { deep: true });

        watch(() => props.presetIdFilters, () => {
            if (props.useApi) {
                currentPage.value = 1;
                fetchItems();
            }
        }, { deep: true });

        watch(() => props.searchQuery, () => {
            if (props.useApi) {
                currentPage.value = 1;
                fetchItems();
            }
        });

        watch([() => props.sortField, () => props.sortOrder, () => props.maxDisplayItems], () => {
            if (props.useApi) {
                fetchItems();
            }
        });

        onMounted(() => {
            initializeData();
        });

        return {
            items,
            limitedItems,
            loading,
            error,
            currentPage,
            pageSize,
            totalCount,
            finalLayout,
            carouselBreakpoints,
            handlePageChange,
            handlePageSizeChange,
            onMoreClick,
            fetchItems
        };
    },
});
</script>

<style scoped>
.resource-listing {
    border: 0;
    margin-top: 0px;
}

.carousel-container {
    padding: 2px 0;
    width: 100%;
    position: relative;
}



@media (max-width: 768px) {

    .carousel-container {
        padding: 10px 0;
    }
}

@media (max-width: 480px) {
    .carousel-container {
        padding: 5px 0;
    }
}
</style>