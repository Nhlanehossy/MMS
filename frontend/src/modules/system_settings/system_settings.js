import { translationKeys } from '@/executables/translation';
import { render } from 'lightgallery/vue';
import * as Yup from "yup";

export const system_settings = [
  {
    name: "notifications",
    path: "notifications",
    icon: "fa fa-bell", 
    resourceGroup: translationKeys.SystemSettings || "System",
    label: translationKeys.Notifications||"Notifications",
    renderMode: "notifications",
  },
  {
    name: "system-logs",
    path: "system-logs",
    icon: "fa fa-file",
    label: translationKeys.SystemLogs || "System Logs",
    menuGroup: translationKeys.Security || "Security",
    menuGroupIcon: "fa fa-shield",
    renderMode: "crud",
    schema: [

      {
        name: "action",
        title: translationKeys.Action || "Action",
        type: "text",
        validation: Yup.string().required("Action is required"),
      },
      {
        name: "user",
        title: translationKeys.User || "User",
        type: "text",
        validation: Yup.string().required("User is required"),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "status",
        options: [
          { label: "Success", value: "Success", color: "#28a745" },
          { label: "Failure", value: "Failure", color: "#dc3545" }
        ],
        validation: Yup.string().required("Status is required"),
      }
    ],
    layout: {
      rows: 1,
      columns: 3,
      fields: {
        action: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
        user: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
        status: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 }
      }
    }
  },
  {
    name: "company-config",
    path: "company-config",
    icon: "fa fa-building", // Replaced "fa fa-building"
    label: translationKeys.CompanyConfiguration,
    menuGroup: translationKeys.Settings,
    menuGroupIcon: "fa fa-cog", // Replaced "fa fa-cog"
    resourceGroup: translationKeys.SystemSettings || "System Settings",
    schema: [
      {
        name: "logo",
        title: translationKeys.CompanyLogo,
        type: "image",
      },
      {
        name: "companyName",
        title: translationKeys.CompanyName,
        type: "text",
      },
      {
        name: "companyGoogleMapLink",
        title: translationKeys.CompanyGoogleMapLink,
        type: "text",
      },
      {
        name: "companyEmails",
        title: translationKeys.CompanyEmails,
        type: "object array",
        schema: [
          {
            name: "name",
            title: translationKeys.Name,
            type: "text",
          },
          {
            name: "email",
            title: translationKeys.Email,
            type: "email",
          },
        ],
      },

      {
        name: "companyPhoneNumbers",
        title: translationKeys.CompanyPhoneNumbers,
        type: "object array",
        schema: [
          {
            name: "name",
            title: translationKeys.Name,
            type: "text",
          },
          {
            name: "phoneNumber",
            title: translationKeys.PhoneNumber,
            type: "text",
          },
        ],
      },
      {
        name: "companySocialMediaLinks",
        title: translationKeys.CompanySocialMediaLinks,
        type: "object array",
        schema: [
          {
            name: "icon",
            title: translationKeys.Icon,
            type: "icon",
          },
          {
            name: "name",
            title: translationKeys.Name,
            type: "text",
          },
          {
            name: "link",
            title: translationKeys.Link,
            type: "text",
          },
        ],
      },
      {
        name: "companyAddress",
        title: translationKeys.CompanyAddress,
        type: "richtext",
      },
      {
        name: "companyLocation",
        title: translationKeys.Location,
        type: "richtext",
      },
      {
        name: "companyMotto",
        title: translationKeys.Motto,
        type: "richtext",
      },
    ],
    renderMode: "singleton",
  },
  {
    name: "system-config",
    path: "system-config",
    icon: "fa fa-cog", // Replaced "fa fa-cog"
    label: translationKeys.SystemConfiguration,
    menuGroup: translationKeys.Settings,
    menuGroupIcon: "fa fa-wrench", // Replaced "fa fa-wrench"
    renderMode: "system-config",
    resourceGroup: translationKeys.SystemSettings || "System Settings",
  },

];
