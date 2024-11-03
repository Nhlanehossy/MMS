import { translationKeys } from '@/Localization/International/english';
import * as Yup from 'yup';
import { Resources } from '../../../../data/resources';


// Initial Data for Application Metrics
const initialAppMetricsData = [
  {
    metricName: "Total Users",
    value: 150,
    icon: "pi pi-user"
  },
  {
    metricName: "Active Sessions",
    value: 75,
    icon: "pi pi-users"
  },
  {
    metricName: "Total Modules",
    value: 10,
    icon: "pi pi-box"
  },

];

// User Management Resource
const userManagementResource = Resources.find(resource => resource.path === "users");

// Module Management Resource
const moduleManagementResource = Resources.find(resource => resource.path === "modules");

// System Logs Resource
const systemLogsResource = Resources.find(resource => resource.path === "system-logs");
// Application Metrics Resource
const appMetricsResource = {
  name: "Application Metrics",
  path: "app-metrics",
  icon: "pi pi-chart-line", // Added icon for Application Metrics
  label: translationKeys.AppMetrics || "Application Metrics",
  menuGroup: translationKeys.Metrics || "Metrics",
  menuGroupIcon: "pi pi-chart-bar",
  schema: [
    {
      name: "metricName",
      title: translationKeys.MetricName || "Metric Name",
      type: "text",
      validation: Yup.string().required("Metric name is required"),
    },
    {
      name: "value",
      title: translationKeys.Value || "Value",
      type: "text",
      validation: Yup.string().required("Value is required"),
    },
    {
      name:"icon",
      title: translationKeys.Icon || "Icon",
      type: "icon",
      validation: Yup.string().required("Icon is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 9, // Updated columns to x3
    fields: {
      metricName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 3 },
      value: { rowStart: 1, colStart: 4, rowSpan: 1, colSpan: 3 },
      icon: { rowStart: 2, colStart: 1, rowSpan: 2, colSpan: 9 }
    }
  }
};

// Block Configurations
export const blockConfigs = [
  {
    id: 'app-metrics-block', // Moved Application Metrics block to the top
    name: 'Application Metrics',
    config: {
      type: 'data-group',
      props: {
        resource: appMetricsResource,
        showHeader:false,
        displayMode: 'grid',
        layout: appMetricsResource.layout,
        useApi: false,
        initialData: initialAppMetricsData
      }
    }
  },
  {
    id: 'user-management-block',
    name: 'User Management',
    title: 'Active Users',
    config: {
      type: 'data-group',
      props: {
        resource: userManagementResource,
        showHeader:false,
        maxDisplayItems: 3,
        displayMode:'list',
        layout: userManagementResource.layout,
        useApi: true,
        showMoreLink: true,
      }
    }
  },
  {
    id: 'module-management-block',
    name: 'Module Management',
    title: 'Manage System Modules',
    config: {
      type: 'data-group',
      props: {
        resource: moduleManagementResource,
        displayMode:'list',
        maxDisplayItems: 5,
        showHeader:false,
        layout: moduleManagementResource.layout,
        useApi: true,
        showMoreLink: true,
      }
    }
  },
  {
    id: 'system-logs-block',
    name: 'System Logs',
    title: 'System Logs',
    config: {
      type: 'data-group',
      props: {
        resource: systemLogsResource,
        showHeader:false,
        layout: systemLogsResource.layout,
        useApi: true,
        showMoreLink: true,

      }
    }
  }
];

// Layout Configuration
export const layout = [
  
  { name: 'User Management', rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 8 }, // User Management
  { name: 'Module Management',      rowStart: 2, colStart: 9, rowSpan: 1, colSpan: 4},
  { name: 'System Logs', rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 12 }, // System Logs side by side with User Management
];

// Dashboard Configuration
export const dashboardConfig = {
  title: "Admin Dashboard",
  refreshInterval: 300000, // 5 minutes
  allowExport: true,
  exportFormats: ['pdf', 'excel'],
  notifications: {
    enabled: true,
    position: 'top-right',
    defaultDuration: 5000,
    types: {
      user: {
        icon: 'pi pi-users',
        severity: 'info'
      },
      module: {
        icon: 'pi pi-cog',
        severity: 'success'
      },
      log: {
        icon: 'pi pi-file',
        severity: 'warning'
      }
    }
  },
  filters: {
    enabled: true,
    defaultFilters: ['date', 'status'],
    customFilters: [
      {
        name: 'role',
        type: 'select',
        options: ['Admin', 'User']
      },
      {
        name: 'module',
        type: 'select',
        options: ['User Management', 'Financial Management', 'Project Management']
      }
    ]
  },
  theme: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8'
  }
};

export default {
  blockConfigs,
  layout,
  dashboardConfig
};
