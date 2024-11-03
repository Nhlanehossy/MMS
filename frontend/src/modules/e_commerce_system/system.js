import { v4 as uuidv4 } from "uuid";
import { translationKeys } from "@/executables/translation";
import * as Yup from "yup";

export const e_commerce_management_system = [
  {
    name: "shops",
    path: "shops",
    icon: "pi pi-shopping-bag",
    label: translationKeys.Shops || "Shops",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "image",
        title: translationKeys.Image || "Image",
        type: "image",
        validation: Yup.string().required("Image is required."),
      },
      {
        name: "shopName",
        title: translationKeys.ShopName || "Shop Name",
        type: "text",
        validation: Yup.string().required("Shop Name is required."),
      },
      {
        name: "owner",
        title: translationKeys.Owner || "Owner",
        type: "me",
        defaultValue:'current_user_id',
      },
      {
        name: "description",
        title: translationKeys.Description || "Description",
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
    ],
    isPortal:true,
    portalDefinition: {
      name: "shops",
      url: "/shops",
      type: "user",
      dashboardType:'overview',
      icon: "pi pi-home",
    },
    renderMode: "crud",
    layout: {
      rows: 3,
      columns: 3,
      fields: {
        image: { rowStart: 1, colStart: 1, rowSpan: 3, colSpan: 1, alignment: 'center' }, // Using more rows for a larger image
        shopName: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 2, alignment: 'top-left' }, // Expanding to the right
        owner: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        description: { rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 2, alignment: 'top-left' }, // Expanding description to fill more space
      },
      actions: [
        {
          name: 'ecommerce_actions',
          rowStart: 1,
          rowSpan: 1,
          colStart: 3,
          colSpan: 1,
          alignment: 'top-right',
          actions: [
            { name: 'goToView', icon: 'pi pi-eye', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-pencil', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;',
        },
      ],
    }
    
  },
  {
    name: "orders",
    path: "orders",
    icon: "pi pi-shopping-cart",
    label: translationKeys.Orders || "Orders",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "orderNumber",
        title: translationKeys.OrderNumber || "Order Number",
        type: "text",
        defaultValue: () => `ORD-${uuidv4().split("-")[0]}`,
        validation: Yup.string().required("Order Number is required."),
      },
      {
        name: "user",
        title: translationKeys.User || "User",
        type: "ref",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("User is required."),
      },
      {
        name: "product",
        title: translationKeys.Product || "Product",
        type: "ref",
        resource: "products",
        field: "productName",
        validation: Yup.string().required("Product is required."),
      },
      {
        name: "quantity",
        title: translationKeys.Quantity || "Quantity",
        type: "number",
        validation: Yup.number()
          .required("Quantity is required.")
          .positive("Quantity must be positive."),
      },
      {
        name: "orderDate",
        title: translationKeys.OrderDate || "Order Date",
        type: "date",
        defaultValue: new Date().toISOString().split("T")[0],
        validation: Yup.date().required("Order Date is required."),
      },

      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "Processing", value: "processing", color: "#007ACC" },
          { label: "Shipped", value: "shipped", color: "#008000" },
          { label: "Delivered", value: "delivered", color: "#008080" },
          { label: "Cancelled", value: "cancelled", color: "#FF6347" },
        ],
        defaultValue: "pending",
        validation: Yup.string().required("Status is required."),
      },
    ],
    renderMode: "crud",
    layout: {
      rows: 4, // Adjusted for balance
      columns: 2,
      fields: {
        orderNumber: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        user: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        product: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        quantity: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        orderDate: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        shop: { rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        status: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
      },
      actions: [
        {
          name: 'ecommerce_actions', // Unified action name
          rowStart: 1, // Moved actions to the top row
          rowSpan: 1,
          colStart: 2, // Adjusted to be in the right column
          colSpan: 1, // Spanning one column for better visibility
          alignment: 'top-right', // Aligned to the top right
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: relative; top: 0.5rem; z-index: 10;'
        }
      ]
    },
  },
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
        title:"price",
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
      columns: 8,
      fields: {
        images: { 
          rowStart: 1, 
          rowSpan: 5, 
          colStart: 1, 
          colSpan: 4 
        },
        productName: { 
          rowStart: 2, 
          rowSpan: 1, 
          colStart: 5, 
          colSpan: 4 
        },
        price: { 
          rowStart: 3, 
          rowSpan: 1, 
          colStart: 5, 
          colSpan: 4 
        },
        category: { 
          rowStart: 4, 
          rowSpan: 1, 
          colStart: 5, 
          colSpan: 4 
        },
        description: { 
          rowStart: 5, 
          rowSpan: 1, 
          colStart: 5, 
          colSpan: 4 
        }
      },
      actions: [
        {
          name: 'product_secondary_actions',
          rowStart: 1,
          rowSpan: 1,
          colStart: 8,
          colSpan: 1,
          alignment: 'top-right',
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' }
          ],
          orientation: 'dropdown',
          style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
        }
      ]
    }
  },
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
      rows: 3,
      columns: 2,
      fields: {
        // Main image on the left
        image: { 
          rowStart: 1, 
          colStart: 1, 
          rowSpan: 2, // Increased rowSpan for better image display
          colSpan: 1, 
          alignment: 'middle-center' 
        },
        // Icon next to the image
        icon: { 
          rowStart: 1, 
          colStart: 2, 
          rowSpan: 1, 
          colSpan: 1, 
          alignment: 'middle-left' 
        },
        // Category name below image
        categoryName: { 
          rowStart: 3, 
          colStart: 1, 
          rowSpan: 1, 
          colSpan: 1, 
          alignment: 'middle-left' 
        },
        // Description taking up space next to image
        description: { 
          rowStart: 2, 
          colStart: 2, 
          rowSpan: 2, 
          colSpan: 1, 
          alignment: 'top-left' 
        }
      },
      actions: [
        {
          name: 'ecommerce_actions',
          rowStart: 1,
          rowSpan: 1,
          colStart: 2,
          colSpan: 1,
          alignment: 'top-right',
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' }
          ],
          orientation: 'dropdown',
          style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
        }
      ]
    },
  },
  {
    name: "reviews",
    path: "reviews",
    icon: "pi pi-star",
    label: translationKeys.Reviews || "Reviews",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "product",
        title: translationKeys.Product || "Product",
        type: "ref",
        resource: "products",
        field: "productName",
        validation: Yup.string().required("Product is required."),
      },
      {
        name: "user",
        title: translationKeys.User || "User",
        type: "ref",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("User is required."),
      },
      {
        name: "rating",
        title: translationKeys.Rating || "Rating",
        type: "number",
        validation: Yup.number().required("Rating is required.").min(1).max(5),
      },
      {
        name: "comment",
        title: translationKeys.Comment || "Comment",
        type: "richtext",
        validation: Yup.string().required("Comment is required."),
      },
    ],
    renderMode: "crud",
    layout: {
      rows: 3,
      columns: 3,
      fields: {
        images: { rowStart: 1, colStart: 1, rowSpan: 2, colSpan: 1, alignment: 'center' },
        productName: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 2, alignment: 'top-left' },
        shop: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        category: { rowStart: 2, colStart: 3, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        price: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        materials: { rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        tags: { rowStart: 3, colStart: 3, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        description: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 3, alignment: 'top-left' },
      },
      actions: [
        {
          name: 'ecommerce_actions',
          rowStart: 1,
          rowSpan: 1,
          colStart: 3,
          colSpan: 1,
          alignment: 'top-right',
          actions: [
            { name: 'goToView', icon: 'pi pi-eye', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-pencil', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
        }
      ]
    }
  },
  {
    name: "materials",
    path: "materials",
    icon: "pi pi-box",
    label: translationKeys.Materials || "Materials",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "materialName",
        title: translationKeys.MaterialName || "Material Name",
        type: "text",
        validation: Yup.string().required("Material Name is required."),
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
      rows: 1, // Adjusted for balance
      columns: 2,
      fields: {
        materialName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        description: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
      },
      actions: [
        {
          name: 'ecommerce_actions', // Unified action name
          rowStart: 1, // Moved actions to the top row
          rowSpan: 1,
          colStart: 2, // Adjusted to be in the right column
          colSpan: 1, // Spanning one column for better visibility
          alignment: 'top-right', // Aligned to the top right
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: relative; top: 0.5rem; z-index: 10;'
        }
      ]
    },
  },
  {
    name: "tags",
    path: "tags",
    icon: "pi pi-tags",
    label: translationKeys.Tags || "Tags",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "icon",
        title: translationKeys.Icon || "Icon",
        type: "icon",
        validation: Yup.string().nullable(), // Added validation
      },
      {
        name: "tagName",
        title: translationKeys.TagName || "Tag Name",
        type: "text",
        validation: Yup.string().required("Tag Name is required."),
      },
    ],
    renderMode: "crud",
    layout: {
      rows: 1, // Adjusted for balance
      columns: 2,
      fields: {
        icon: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        tagName: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
      },
      actions: [
        {
          name: 'ecommerce_actions', // Unified action name
          rowStart: 1, // Moved actions to the top row
          rowSpan: 1,
          colStart: 2, // Adjusted to be in the right column
          colSpan: 1, // Spanning one column for better visibility
          alignment: 'top-right', // Aligned to the top right
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: relative; top: 0.5rem; z-index: 10;'
        }
      ]
    },
  },

  {
    name: "payments",
    path: "payments",
    icon: "pi pi-credit-card",
    label: translationKeys.Payments || "Payments",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "paymentId",
        title: translationKeys.PaymentId || "Payment ID",
        type: "text",
        defaultValue: () => `PAY-${uuidv4().split("-")[0]}`,
        validation: Yup.string().required("Payment ID is required."),
      },
      {
        name: "order",
        title: translationKeys.Order || "Order",
        type: "ref",
        resource: "orders",
        field: "orderNumber",
        validation: Yup.string().required("Order is required."),
      },
      {
        name: "amount",
        title: translationKeys.Amount || "Amount",
        type: "number",
        validation: Yup.number()
          .required("Amount is required.")
          .positive("Amount must be positive."),
      },
      {
        name: "paymentMethod",
        title: translationKeys.PaymentMethod || "Payment Method",
        type: "ref",
        resource: "paymentMethods",
        field: "methodName",
        validation: Yup.string().required("Payment Method is required."),
      },
      {
        name: "paymentDate",
        title: translationKeys.PaymentDate || "Payment Date",
        type: "date",
        defaultValue: new Date().toISOString().split("T")[0],
        validation: Yup.date().required("Payment Date is required."),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "Completed", value: "completed", color: "#008000" },
          { label: "Failed", value: "failed", color: "#FF6347" },
          { label: "Refunded", value: "refunded", color: "#008080" },
        ],
        defaultValue: "pending",
        validation: Yup.string().required("Status is required."),
      },
    ],
    renderMode: "crud",
    layout: {
      rows: 4, // Adjusted for balance
      columns: 2,
      fields: {
        paymentId: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        order: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        amount: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        paymentMethod: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        paymentDate: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        status: { rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
      },
      actions: [
        {
          name: 'ecommerce_actions', // Unified action name
          rowStart: 1, // Moved actions to the top row
          rowSpan: 1,
          colStart: 2, // Adjusted to be in the right column
          colSpan: 1, // Spanning one column for better visibility
          alignment: 'top-right', // Aligned to the top right
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: relative; top: 0.5rem; z-index: 10;'
        }
      ]
    },
  },
  {
    name: "paymentMethods",
    path: "paymentMethods",
    icon: "pi pi-credit-card",
    label: translationKeys.PaymentMethods || "Payment Methods",
    resourceGroup: translationKeys.ECommerceSystem || "e-commerce",
    schema: [
      {
        name: "icon",
        title: translationKeys.Icon || "Icon",
        type: "icon",
        validation: Yup.string().required("Icon is required."),
      },
      {
        name: "methodName",
        title: translationKeys.MethodName || "Method Name",
        type: "text",
        validation: Yup.string().required("Method Name is required."),
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
      rows: 2, // Adjusted for balance
      columns: 2,
      fields: {
        icon: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        methodName: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
        description: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1, alignment: 'top-left' },
      },
      actions: [
        {
          name: 'ecommerce_actions', // Unified action name
          rowStart: 1, // Moved actions to the top row
          rowSpan: 1,
          colStart: 2, // Adjusted to be in the right column
          colSpan: 1, // Spanning one column for better visibility
          alignment: 'top-right', // Aligned to the top right
          actions: [
            { name: 'goToView', icon: 'pi pi-key', label: 'View' },
            { name: 'goToEdit', icon: 'pi pi-eye', label: 'Edit' },
            { name: 'deleteResource', icon: 'pi pi-trash', label: 'Delete' },
          ],
          orientation: 'dropdown',
          style: 'position: relative; top: 0.5rem; z-index: 10;'
        }
      ]
    },
  },
];