<template>
    <div class="inventory-management">
      <a-layout>
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
          <div class="logo">Inventory</div>
          <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
            <a-menu-item key="1">
              <user-outlined />
              <span>Dashboard</span>
            </a-menu-item>
            <a-menu-item key="2">
              <shopping-outlined />
              <span>Products</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0">
            <a-row type="flex" justify="space-between" align="middle">
              <a-col :span="8">
                <a-input-search
                  v-model:value="searchQuery"
                  placeholder="Search items"
                  style="width: 200px"
                  @search="onSearch"
                />
              </a-col>
              <a-col :span="8" style="text-align: right">
                <a-button type="primary" @click="showAddModal">
                  Add New Item
                </a-button>
              </a-col>
            </a-row>
          </a-layout-header>
          <a-layout-content style="margin: 0 16px">
            <a-row :gutter="16" style="margin-top: 16px">
              <a-col :span="6">
                <a-select
                  v-model:value="selectedCategory"
                  style="width: 100%"
                  placeholder="Filter by category"
                  @change="filterByCategory"
                >
                  <a-select-option value="">All Categories</a-select-option>
                  <a-select-option
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6">
                <a-select
                  v-model:value="selectedStockLevel"
                  style="width: 100%"
                  placeholder="Filter by stock level"
                  @change="filterByStockLevel"
                >
                  <a-select-option value="">All Stock Levels</a-select-option>
                  <a-select-option value="low">Low Stock</a-select-option>
                  <a-select-option value="medium">Medium Stock</a-select-option>
                  <a-select-option value="high">High Stock</a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <a-table
              :columns="columns"
              :data-source="filteredItems"
              :rowKey="(record) => record.id"
              style="margin-top: 16px"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                  <a-space size="small">
                    <a-button type="primary" @click="showEditModal(record)">
                      Edit
                    </a-button>
                    <a-button type="danger" @click="deleteItem(record)">
                      Delete
                    </a-button>
                  </a-space>
                </template>
              </template>
            </a-table>
          </a-layout-content>
        </a-layout>
      </a-layout>
  
      <a-modal
        v-model:visible="modalVisible"
        :title="modalMode === 'add' ? 'Add New Item' : 'Edit Item'"
        @ok="handleModalOk"
      >
        <a-form :model="formState" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="Name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="SKU">
            <a-input v-model:value="formState.sku" />
          </a-form-item>
          <a-form-item label="Quantity">
            <a-input-number v-model:value="formState.quantity" :min="0" style="width: 100%" />
          </a-form-item>
          <a-form-item label="Price">
            <a-input-number
              v-model:value="formState.price"
              :min="0"
              :step="0.01"
              :precision="2"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="Category">
            <a-select v-model:value="formState.category">
              <a-select-option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, reactive, computed } from 'vue';
  import axios from 'axios';
  import {
    UserOutlined,
    ShoppingOutlined,
  } from '@ant-design/icons-vue';
  
  export default defineComponent({
    components: {
      UserOutlined,
      ShoppingOutlined,
    },
    setup() {
      const collapsed = ref(false);
      const selectedKeys = ref(['2']);
      const items = ref([]);
      const searchQuery = ref('');
      const selectedCategory = ref('');
      const selectedStockLevel = ref('');
      const modalVisible = ref(false);
      const modalMode = ref('add');
      const formState = reactive({
        id: null,
        name: '',
        sku: '',
        quantity: 0,
        price: 0,
        category: '',
      });
  
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'SKU',
          dataIndex: 'sku',
          key: 'sku',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
        },
        {
          title: 'Action',
          key: 'action',
          fixed: 'right',
          width: 200,
        },
      ];
  
      const categories = computed(() => {
        return [...new Set(items.value.map(item => item.category))];
      });
  
      const filteredItems = computed(() => {
        return items.value.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                                item.sku.toLowerCase().includes(searchQuery.value.toLowerCase());
          const matchesCategory = !selectedCategory.value || item.category === selectedCategory.value;
          const matchesStockLevel = !selectedStockLevel.value || 
                                    (selectedStockLevel.value === 'low' && item.quantity < 10) ||
                                    (selectedStockLevel.value === 'medium' && item.quantity >= 10 && item.quantity < 50) ||
                                    (selectedStockLevel.value === 'high' && item.quantity >= 50);
          return matchesSearch && matchesCategory && matchesStockLevel;
        });
      });
  
      const fetchItems = async () => {
        try {
          // Uncomment the following line to fetch from an API
          // const response = await axios.get('https://api.example.com/inventory');
          // items.value = response.data;
  
          // For demonstration, we'll use a local array
          items.value = [
            { id: 1, name: 'Item 1', sku: 'SKU001', quantity: 5, price: 9.99, category: 'Category A' },
            { id: 2, name: 'Item 2', sku: 'SKU002', quantity: 15, price: 19.99, category: 'Category B' },
            { id: 3, name: 'Item 3', sku: 'SKU003', quantity: 60, price: 29.99, category: 'Category A' },
          ];
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      };
  
      const onSearch = () => {
        // The computed property 'filteredItems' will handle the search
      };
  
      const filterByCategory = () => {
        // The computed property 'filteredItems' will handle the category filtering
      };
  
      const filterByStockLevel = () => {
        // The computed property 'filteredItems' will handle the stock level filtering
      };
  
      const showAddModal = () => {
        modalMode.value = 'add';
        Object.assign(formState, {
          id: null,
          name: '',
          sku: '',
          quantity: 0,
          price: 0,
          category: '',
        });
        modalVisible.value = true;
      };
  
      const showEditModal = (record) => {
        modalMode.value = 'edit';
        Object.assign(formState, record);
        modalVisible.value = true;
      };
  
      const handleModalOk = () => {
        if (modalMode.value === 'add') {
          // Add new item
          const newItem = {
            id: items.value.length + 1,
            ...formState,
          };
          items.value.push(newItem);
        } else {
          // Edit existing item
          const index = items.value.findIndex(item => item.id === formState.id);
          if (index !== -1) {
            items.value[index] = { ...formState };
          }
        }
        modalVisible.value = false;
      };
  
      const deleteItem = (record) => {
        items.value = items.value.filter(item => item.id !== record.id);
      };
  
      fetchItems();
  
      return {
        collapsed,
        selectedKeys,
        items,
        columns,
        searchQuery,
        selectedCategory,
        selectedStockLevel,
        categories,
        filteredItems,
        modalVisible,
        modalMode,
        formState,
        onSearch,
        filterByCategory,
        filterByStockLevel,
        showAddModal,
        showEditModal,
        handleModalOk,
        deleteItem,
      };
    },
  });
  </script>
  
  <style scoped>
  .inventory-management {
    height: 100vh;
  }
  
  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }
  
  .ant-layout-sider-collapsed .logo {
    font-size: 14px;
  }
  
  .ant-layout-header {
    padding: 0 16px !important;
  }
  
  @media (max-width: 768px) {
    .ant-layout-sider {
      position: absolute;
      z-index: 1;
      height: 100%;
    }
  
    .ant-layout-content {
      margin: 0 !important;
      padding: 16px;
    }
  
    .ant-table {
      overflow-x: auto;
    }
  }
  </style>