<template>
  <div class="container mx-auto">
    <!-- Main Grid Container -->
    <div class="grid grid-cols-1 gap-6">
      <!-- Categories - Full Width -->
      <div class="w-full">
        <DataGroup :resource="categoryResource" display-mode="carousel" :Layout="resource.layout"
          :show-pagination="true" :show-header="true" header-title="Categories" :show-more-link="false"
          more-link-text="View All" pagination-mode="none" :max-display-items="6" sort-field="" sort-order="asc"
          @more-click="handleMoreClick" :carousel-items-to-show="3" @fetch-success="handleFetchSuccess"
          @fetch-error="handleFetchError" @page-change="handlePageChange" @page-size-change="handlePageSizeChange" />
      </div>

      <!-- New Arrivals - Full Width -->
      <div class="w-full">
        <DataGroup :resource="resource" display-mode="carousel" :Layout="resource.layout" :show-pagination="true"
          :show-header="true" header-title="New Arrivals" :show-more-link="false" more-link-text="View All"
          pagination-mode="none" :max-display-items="5" sort-field="" sort-order="asc" @more-click="handleMoreClick"
          :carousel-items-to-show="3" @fetch-success="handleFetchSuccess" @fetch-error="handleFetchError"
          @page-change="handlePageChange" @page-size-change="handlePageSizeChange" />
      </div>

      <!-- Trending and Latest Section -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
        <!-- Trending Section - 3/4 Width -->
        <div class="md:col-span-4">
          <DataGroup :resource="productPrimeResource" display-mode="list" :Layout="productPrimeResource.layout"
            :show-pagination="true" :show-header="true" header-title="Trending" :show-more-link="false"
            more-link-text="View All" :max-display-items="7" sort-field="" sort-order="desc" pagination-mode="none"
            @more-click="handleMoreClick" @fetch-success="handleFetchSuccess" @fetch-error="handleFetchError"
            @page-change="handlePageChange" @page-size-change="handlePageSizeChange" />
        </div>

        <!-- Latest Section - 1/4 Width -->
        <div class="md:col-span-2">
          <DataGroup :resource="resource" display-mode="list" :Layout="resource.layout" :show-pagination="true"
            :show-header="true" header-title="Latest" :show-more-link="false" more-link-text="View All"
            :max-display-items="24" sort-field="" sort-order="asc" @more-click="handleMoreClick" pagination-mode="none"
            @fetch-success="handleFetchSuccess" @fetch-error="handleFetchError" @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange" />
        </div>
      </div>
    </div>
  </div>


  <!--
  
    <DataGroup
    :resource="resource"
    display-mode="grid"
    :show-pagination="true"
    :show-header="true"
    header-title="Products"
    :show-more-link="false"
    more-link-text="View All"
    :max-display-items="12"
    :preset-filters="{
      status: 'active',
      category: ['electronics', 'books'],
      : { $gte: 100, $lte: 1000 }
    }"
    :preset-id-filters="{
      manufacturerId: '507f1f77bcf86cd799439011',
      categoryIds: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']
    }"
    search-query="laptop"
    sort-field=""
    sort-order="asc"
    @more-click="handleMoreClick"
    @fetch-success="handleFetchSuccess"
    @fetch-error="handleFetchError"
    @page-change="handlePageChange"
    @page-size-change="handlePageSizeChange"
  />
  -->
</template>



<script>
import { handleError, ref } from 'vue';
import DynamicCrud from '@/components/Object/DynamicCrud.vue';
import { e_commerce_management_system } from '../../modules/e_commerce_system/system';
import DataGroup from '../../components/Object/DataGroup.vue';
import { translationKeys } from "@/executables/translation";
import * as Yup from "yup";


export default {
  components: {
    DynamicCrud,
    DataGroup
  },
  setup() {
    const resource = ref(e_commerce_management_system.find(r => r.name === 'products'))
    const productPrimeResource = ref(
      {
        name: "products",
        path: "products",
        icon: "pi pi-box",
        label: translationKeys.Products || "Products",
        resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
        schema: [
          {
            name: "images",
            title: translationKeys.Image || "Images",
            type: "image array",
            validation: Yup.array().of(Yup.string().nullable()), // Added validation
          },
          {
            name: "productName",
            title: translationKeys.ProductName || "Product Name",
            type: "text",
            validation: Yup.string().required("Product Name is required."),
          },

          {
            name: "category",
            title: translationKeys.Category || "Category",
            type: "ref",
            resource: "categories",
            field: "categoryName",
            validation: Yup.string().required("Category is required."),
          },
          {
            name: "price",
            title: "price",
            type: "price",
            validation: Yup.string().required("Price is required."),
          },

          {
            name: "description",
            title: translationKeys.Description || "Description",
            type: "richtext",
            validation: Yup.string().required("Description is required."),
          },

        ],
        renderMode: "crud",
        layout:{
  rows: 5,
  columns: 9,
  fields: {
    // Main image section
    images: {
      rowStart: 1,
      rowSpan: 5,
      colStart: 1,
      colSpan: 4
    },
    // Product info sections
    productName: {
      rowStart: 2,
      rowSpan: 1,
      colStart: 5,
      colSpan: 5
    },
    price: {
      rowStart: 3,
      rowSpan: 1,
      colStart: 5,
      colSpan: 3
    },
    category: {
      rowStart: 3,
      rowSpan: 1,
      colStart: 8,
      colSpan: 2
    },
    mainActions: {
      rowStart: 4,
      rowSpan: 1,
      colStart: 5,
      colSpan: 5
    }
  },
  actions: [
    {
      // Secondary actions dropdown
      name: 'product_secondary_actions',
      rowStart: 1,
      rowSpan: 1,
      colStart: 9,
      colSpan: 1,
      alignment: 'top-right',
      actions: [
        { name: 'bookmark', icon: 'fa fa-bookmark', label: 'Bookmark' },
        { name: 'dontRecommendProduct', icon: 'pi pi-times-circle', label: 'Don\'t Recommend' },
        { name: 'report', icon: 'fa fa-flag', label: 'Report' }
      ],
      orientation: 'dropdown',
      style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
    },
    {
      // Main action buttons
      name: 'product_main_actions',
      rowStart: 4,
      rowSpan: 1,
      colStart: 5,
      colSpan: 5,
      alignment: 'bottom-right',
      actions: [
        { name: 'addToCart', icon: 'fa fa-shopping-cart', label: 'Add' }
      ],
      orientation: 'buttons'
    }
  ]
}
      },
    );


    const categoryResource = ref(
      {
        name: "categories",
        path: "categories",
        icon: "pi pi-tag",
        label: translationKeys.Categories || "Categories",
        resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
        schema: [
          {
            name: "image",
            title: translationKeys.Image || "Image",
            type: "image",
            validation: Yup.string().required("Image is required."),
          },
          {
            name: "icon",
            title: translationKeys.Icon || "Icon",
            type: "icon",
            validation: Yup.string().nullable(), // Added validation
          },
          {
            name: "categoryName",
            title: translationKeys.CategoryName || "Category Name",
            type: "text",
            validation: Yup.string().required("Category Name is required."),
          },
          {
            name: "description",
            title: translationKeys.Description || "Description",
            type: "richtext",
            validation: Yup.string().required("Description is required."),
          },
        ],
        renderMode: "crud",
        layout: {
  rows: 7,
  columns: 1,
  fields: {
    // Main image positioned at the top
    image: {
      rowStart: 1,
      colStart: 1,
      rowSpan: 6,
      colSpan: 1,
      alignment: 'center'
    },
    // Category name below the image
    categoryName: {
      rowStart: 7,
      colStart: 1,
      rowSpan: 1,
      colSpan: 1,
      alignment: 'center'
    }
  }
}


      }
    )



    return {
      resource,
      categoryResource,
      productPrimeResource

    };
  },
  methods: {
    handleMoreClick() { },
    handleFetchSuccess() { },
    handleFetchError() { },
    handlePageChange() { },
    handlePageSizeChange() { }
  }
};
</script>
