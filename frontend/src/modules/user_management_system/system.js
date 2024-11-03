import { icon } from "leaflet";
import { translationKeys } from "@/executables/translation";
import * as Yup from "yup";

export const user_management_system = [
  {
    name: "users",
    path: "users",
    icon: "fa fa-users", // Replaced "fa fa-user"
    label: translationKeys.Users,
    isUser: true,
    menuGroup: translationKeys.UserManagement,
    menuGroupIcon: "fa fa-users", // Replaced "fa fa-user-cog"
    resourceGroup: translationKeys.UserManagementSystem || "User Management",
    schema: [
      {
        name: "fullname",
        title: translationKeys.FullName,
        type: "text",
        validation: Yup.string().required("Full Name is required."),
      },
      {
        name: "undefined",
        title: translationKeys.ProfilePicture,
        type: "image",
        validation: Yup.string().required("Image is required."),
      },
      {
        name: "email",
        title: translationKeys.Email,
        type: "email",
        validation: Yup.string()
          .email("Invalid email format.")
          .required("Email is required."),
      },
      {
        name: "password",
        title: translationKeys.Password,
        type: "password",
        defaultValue: "password123",
        validation: Yup.string().required("Password is required."),
      },
      {
        name: "phoneNumber",
        title: translationKeys.PhoneNumber,
        type: "phone",
        validation: Yup.string().required("Phone Number is required."),
      },
      {
        name: "dateOfBirth",
        title: translationKeys.DateOfBirth,
        type: "date",
        validation: Yup.date().required("Date of Birth is required."),
      },
      {
        name: "recruitmentDate",
        title: translationKeys.RecruitmentDate,
        type: "date",
        validation: Yup.date().required("Recruitment Date is required."),
      },
      {
        name: "role",
        title: translationKeys.UserRole,
        type: "ref",
        resource: "roles",
        field: "roleName",
        validation: Yup.string().required("Role is required."),
      },
      {
        name: "status",
        title: translationKeys.Status,
        type: "ref",
        resource: "staff-statuses",
        isStatus: true,
        field: "status",
        validation: Yup.string().required("Status is required."),
      },
      {
        name: "gender",
        title: translationKeys.Gender || "Gender",
        type: "ref",
        resource: "genders",
        field: "gender",
        validation: Yup.string().required("Gender is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("description is required."),
      },
    ],
    renderMode: "crud",
    crudType: "list",
   layout: {
      rows: 4,
      columns: 2,
      fields: {
        undefined: {  // Profile image
          rowStart: 1,
          colStart: 1,
          rowSpan: 4,  // Now spans all rows
          colSpan: 1,
          alignment: "middle-center",
        },
        fullname: {
          rowStart: 1,
          colStart: 2,
          rowSpan: 1,
          colSpan: 1,
          alignment: "middle-left",
        },
        email: {
          rowStart: 2,
          colStart: 2,
          rowSpan: 1,
          colSpan: 1,
          alignment: "middle-left",
        },
        phoneNumber: {
          rowStart: 3,
          colStart: 2,
          rowSpan: 1,
          colSpan: 1,
          alignment: "middle-left",
        },
        role: {
          rowStart: 4,
          colStart: 2,
          rowSpan: 1,
          colSpan: 1,  // Reduced to 1 as it only needs to span the remaining space
          alignment: "middle-left",
        },
      },
      actions: [
        {
          name: "user_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 2,
          colSpan: 1,
          alignment: "top-right",
          actions: [
            { name: "goToView", icon: "fa fa-key", label: "View" },
            { name: "goToEdit", icon: "fa fa-eye", label: "Edit" },
            { name: "deleteResource", icon: "fa fa-trash", label: "Delete" },
          ],
          orientation: "dropdown",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },

    actions: [
      {
        name: "goToView",
        icon: "fa fa-eye",
        label: translationKeys.View || "View",
      },
      {
        name: "goToEdit",
        icon: "fa fa-pencil",
        label: translationKeys.Edit || "Edit",
      },
      {
        name: "deleteResource",
        icon: "fa fa-trash",
        label: translationKeys.Delete || "Delete",
      },
    ],
  },
  {
    name: "staff-statuses",
    path: "staff-statuses",
    icon: "fa fa-check", // Replaced "fa fa-check"
    label: translationKeys.StaffStatuses,
    menuGroup: translationKeys.UserManagement,
    menuGroupIcon: "fa fa-cog", // Replaced "fa fa-user-cog"
    resourceGroup: translationKeys.UserManagementSystem || "User Management",
    schema: [
      {
        name: "status",
        title: translationKeys.Status,
        type: "text",
        validation: Yup.string().required("Status is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
    ],
    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
    layout: {
      rows: 2,
      columns: 2,
      fields: {
        status: {
          rowStart: 1,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        description: {
          rowStart: 2,
          colStart: 1,
          rowSpan: 1,
          colSpan: 2,
          alignment: "top-left",
        },
      },
      actions: [
        {
          name: "status_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 2,
          colSpan: 1,
          alignment: "top-right",
          actions: [
            { name: "goToView", icon: "fa fa-key", label: "View" },
            { name: "goToEdit", icon: "fa fa-eye", label: "Edit" },
            { name: "deleteResource", icon: "fa fa-trash", label: "Delete" },
          ],
          orientation: "dropdown",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },
  {
    name: "genders",
    path: "genders",
    icon: "fa fa-user", // Replaced "fa fa-venus-mars"
    label: translationKeys.Genders,
    menuGroup: translationKeys.UserManagement,
    menuGroupIcon: "fa fa-users", // Replaced "fa fa-user-cog"
    resourceGroup: translationKeys.UserManagementSystem || "User Management",
    schema: [
      {
        name: "gender",
        title: translationKeys.Gender,
        type: "text",
        validation: Yup.string().required("Gender is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
    ],
    renderMode: "crud",
    crudType: "list",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
    layout: {
      rows: 2,
      columns: 1,
      fields: {
        gender: {
          rowStart: 1,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        description: {
          rowStart: 2,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        icon: {
          rowStart: 3,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
      },
      actions: [
        {
          name: "gender_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 1,
          colSpan: 1,
          alignment: "top-right",
          actions: [
            { name: "goToView", icon: "fa fa-key", label: "View" },
            { name: "goToEdit", icon: "fa fa-eye", label: "Edit" },
            { name: "deleteResource", icon: "fa fa-trash", label: "Delete" },
          ],
          orientation: "dropdown",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },
  {
    name: "roles",
    path: "roles",
    icon: "fa fa-bookmark", // Replaced "fa fa-bookmark"
    label: translationKeys.Roles,
    menuGroup: translationKeys.AccessControl,
    menuGroupIcon: "fa fa-shield", // Replaced "fa fa-user-shield"
    resourceGroup: translationKeys.UserManagementSystem || "User Management",
    schema: [
      {
        name: "roleName",
        title: translationKeys.RoleName,
        type: "text",
        validation: Yup.string().required("Role Name is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
    ],
    renderMode: "crud",
    crudType: "table",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
    layout: {
      rows: 2,
      columns: 2,
      fields: {
        roleName: {
          rowStart: 1,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        description: {
          rowStart: 2,
          colStart: 1,
          rowSpan: 1,
          colSpan: 2,
          alignment: "top-left",
        },
      },
      actions: [
        {
          name: "role_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 2,
          colSpan: 1,
          alignment: "top-right",
          actions: [
            { name: "goToView", icon: "fa fa-key", label: "View" },
            { name: "goToEdit", icon: "fa fa-eye", label: "Edit" },
            { name: "deleteResource", icon: "fa fa-trash", label: "Delete" },
          ],
          orientation: "dropdown",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },
  {
    name: "modules",
    path: "modules",
    icon: "fa fa-sitemap", // Replaced "fa fa-cubes"
    label: translationKeys.Modules,
    menuGroup: translationKeys.AccessControl,
    menuGroupIcon: "fa fa-shield", // Replaced "fa fa-user-shield"
    resourceGroup: translationKeys.UserManagementSystem || "User Management",
    schema: [
      {
        name: "moduleName",
        title: translationKeys.ModuleName,
        type: "text",
        validation: Yup.string().required("Module Name is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string()
          .required("Description is required.")
          .min(10, "Description must be at least 10 characters long.")
          .max(50, "Description cannot exceed 50 characters."),
      },
    ],
    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
    layout: {
      rows: 2,
      columns: 2,
      fields: {
        moduleName: {
          rowStart: 1,
          colStart: 1, // Align it to the first cell to create a balanced look
          rowSpan: 1,
          colSpan: 1,
          alignment: "middle-left",
        },
        description: {
          rowStart: 1,
          colStart: 2, // Place it in the adjacent cell to the right
          rowSpan: 1,
          colSpan: 1,
          alignment: "middle-left",
        },
      },
      actions: [
        {
          name: "user_actions",
          rowStart: 2, // Move the actions to the second row for better balance
          rowSpan: 1,
          colStart: 1, // Span across the grid to center-align the actions
          colSpan: 2,
          alignment: "center", // Center the actions to make it look even
          actions: [
            { name: "goToView", icon: "fa fa-key", label: "View" },
            { name: "goToEdit", icon: "fa fa-eye", label: "Edit" },
            { name: "deleteResource", icon: "fa fa-trash", label: "Delete" },
          ],
          orientation: "dropdown",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
    
  },

  {
    name: "permissions",
    path: "permissions",
    icon: "fa fa-shield", // Replaced "fa fa-user-shield"
    label: translationKeys.Permissions,
    menuGroup: translationKeys.AccessControl,
    menuGroupIcon: "fa fa-shield", // Replaced "fa fa-user-shield"
    resourceGroup: translationKeys.UserManagementSystem || "User Management",
    schema: [
      {
        name: "role",
        title: translationKeys.RoleName,
        type: "ref",
        resource: "roles",
        field: "roleName",
        validation: Yup.string().required("Role is required."),
      },
      {
        name: "module",
        title: translationKeys.ModuleName,
        type: "ref",
        resource: "modules",
        field: "moduleName",
        validation: Yup.string().required("Module is required."),
      },
      {
        name: "create",
        title: translationKeys.Create,
        type: "check",
        validation: Yup.string().required("required."),
      },
      {
        name: "read",
        title: translationKeys.Read,
        type: "check",
        validation: Yup.string().required("required."),
      },
      {
        name: "update",
        title: translationKeys.Update,
        type: "check",
        validation: Yup.string().required("required."),
      },
      {
        name: "delete",
        title: translationKeys.Delete,
        type: "check",
        validation: Yup.string().required("required."),
      },
    ],
    renderMode: "crud",

    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
    layout: {
      rows: 4,
      columns: 2,
      fields: {
        role: {
          rowStart: 1,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        module: {
          rowStart: 2,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        create: {
          rowStart: 3,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
        read: {
          rowStart: 4,
          colStart: 1,
          rowSpan: 1,
          colSpan: 1,
          alignment: "top-left",
        },
      },
      actions: [
        {
          name: "permission_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 2,
          colSpan: 1,
          alignment: "top-right",
          actions: [
            { name: "goToView", icon: "fa fa-key", label: "View" },
            { name: "goToEdit", icon: "fa fa-eye", label: "Edit" },
            { name: "deleteResource", icon: "fa fa-trash", label: "Delete" },
          ],
          orientation: "dropdown",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },

];
