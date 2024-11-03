<template>
  <div class="container mt-24 mx-auto">
    <!-- Main Grid Container -->
    <div class="grid grid-cols-1 gap-6">
      <!-- Categories - Full Width -->
      <div class="w-full">
        <DataGroup :resource="categoryResource" display-mode="grid" :Layout="resource.layout" :show-pagination="true"
          :show-header="true" header-title="Categories" :show-more-link="false" more-link-text="View All"
          :max-display-items="150" sort-field="" sort-order="asc" @more-click="handleMoreClick"
          @fetch-success="handleFetchSuccess" @fetch-error="handleFetchError" @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange" />
      </div>

    </div>
  </div>
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
            type: "number",
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
        layout: {
          rows: 5,
          columns: 9,
          fields: {
            // Main image section
            images: {
              rowStart: 1,
              rowSpan: 5,  // Adjusted for 5 rows
              colStart: 1,
              colSpan: 4
            },
            // Product info section
            productName: {
              rowStart: 1,
              rowSpan: 1,
              colStart: 5,
              colSpan: 4
            },
            price: {
              rowStart: 2,
              rowSpan: 1,
              colStart: 5,
              colSpan: 2
            },
            category: {
              rowStart: 2,
              rowSpan: 1,
              colStart: 7,
              colSpan: 3  // Extended to use new column
            },
            description: {
              rowStart: 3,
              rowSpan: 2,
              colStart: 5,
              colSpan: 5  // Extended to use full width
            }
          },
          actions: [
            {
              // Secondary actions dropdown
              name: 'product_secondary_actions',
              rowStart: 1,
              rowSpan: 1,
              colStart: 9,  // Adjusted for new column
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
              rowStart: 5,
              rowSpan: 1,
              colStart: 5,
              colSpan: 5,  // Extended to use full width
              alignment: 'bottom-right',
              actions: [
                { name: 'addToCart', icon: 'fa fa-shopping-cart', label: 'Add' },
                { name: 'goToView', icon: 'fa fa-eye', label: 'View' }
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
  rows: 2,
  columns: 1,
  fields: {
    // Main image positioned at the top
    image: {
      rowStart: 1,
      colStart: 1,
      rowSpan: 1,
      colSpan: 1,
      alignment: 'center'
    },
    // Category name below the image
    categoryName: {
      rowStart: 2,
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
