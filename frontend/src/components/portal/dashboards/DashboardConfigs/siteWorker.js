import { translationKeys } from '@/Localization/International/english';
import * as Yup from 'yup';

// Initial Data for User Management
const initialUserData = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active"
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "Inactive"
  },
  {
    username: "alice_jones",
    email: "alice.jones@example.com",
    role: "User",
    status: "Active"
  }
];

// Initial Data for Module Management
const initialModuleData = [
  {
    moduleName: "User Management",
    status: "Enabled",
    lastUpdated: "2024-04-01"
  },
  {
    moduleName: "Financial Management",
    status: "Enabled",
    lastUpdated: "2024-04-01"
  },
  {
    moduleName: "Project Management",
    status: "Disabled",
    lastUpdated: "2024-03-15"
  }
];

// Initial Data for System Logs
const initialSystemLogsData = [
  {
    timestamp: "2024-04-30 10:00:00",
    action: "User login",
    user: "john_doe",
    status: "Success"
  },
  {
    timestamp: "2024-04-29 14:30:00",
    action: "Module enabled",
    user: "admin_user",
    status: "Success"
  },
  {
    timestamp: "2024-04-28 09:15:00",
    action: "User logout",
    user: "jane_smith",
    status: "Success"
  }
];

// Initial Data for Application Metrics
const initialAppMetricsData = [
  {
    metricName: "Total Users",
    value: 150
  },
  {
    metricName: "Active Sessions",
    value: 75
  },
  {
    metricName: "Total Modules",
    value: 10
  },
  {
    metricName: "System Uptime",
    value: "99.9%"
  }
];

// User Management Resource
const userManagementResource = {
  name: "User Management",
  path: "user-management",
  icon: "pi pi-users",
  label: translationKeys.UserManagement || "User Management",
  menuGroup: translationKeys.Management || "Management",
  menuGroupIcon: "pi pi-cog",
  schema: [
    {
      name: "username",
      title: translationKeys.Username || "Username",
      type: "text",
      validation: Yup.string().required("Username is required"),
    },
    {
      name: "email",
      title: translationKeys.Email || "Email",
      type: "text",
      validation: Yup.string().email("Invalid email").required("Email is required"),
    },
    {
      name: "role",
      title: translationKeys.Role || "Role",
      type: "text",
      validation: Yup.string().required("Role is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "Active", value: "Active", color: "#28a745" },
        { label: "Inactive", value: "Inactive", color: "#dc3545" }
      ],
      validation: Yup.string().required("Status is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      username: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      email: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      role: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Module Management Resource
const moduleManagementResource = {
  name: "Module Management",
  path: "module-management",
  icon: "pi pi-cog",
  label: translationKeys.ModuleManagement || "Module Management",
  menuGroup: translationKeys.Management || "Management",
  menuGroupIcon: "pi pi-cog",
  schema: [
    {
      name: "moduleName",
      title: translationKeys.ModuleName || "Module Name",
      type: "text",
      validation: Yup.string().required("Module name is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "Enabled", value: "Enabled", color: "#28a745" },
        { label: "Disabled", value: "Disabled", color: "#dc3545" }
      ],
      validation: Yup.string().required("Status is required"),
    },
    {
      name: "lastUpdated",
      title: translationKeys.LastUpdated || "Last Updated",
      type: "date",
      validation: Yup.date().required("Last updated date is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      moduleName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      lastUpdated: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 }
    }
  }
};

// System Logs Resource
const systemLogsResource = {
  name: "System Logs",
  path: "system-logs",
  icon: "pi pi-file",
  label: translationKeys.SystemLogs || "System Logs",
  menuGroup: translationKeys.Logs || "Logs",
  menuGroupIcon: "pi pi-folder",
  schema: [
    {
      name: "timestamp",
      title: translationKeys.Timestamp || "Timestamp",
      type: "datetime",
      validation: Yup.date().required("Timestamp is required"),
    },
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
    rows: 2,
    columns: 3,
    fields: {
      timestamp: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      action: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      user: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

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
    }
  ],
  layout: {
    rows: 2,
    columns: 9, // Updated columns to x3
    fields: {
      metricName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 3 },
      value: { rowStart: 1, colStart: 4, rowSpan: 1, colSpan: 3 }
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
    config: {
      type: 'data-group',
      props: {
        resource: userManagementResource,
        showHeader:false,
        layout: userManagementResource.layout,
        useApi: false,
        initialData: initialUserData
      }
    }
  },
  {
    id: 'module-management-block',
    name: 'Module Management',
    config: {
      type: 'data-group',
      props: {
        resource: moduleManagementResource,
        showHeader:false,
        layout: moduleManagementResource.layout,
        useApi: false,
        initialData: initialModuleData
      }
    }
  },
  {
    id: 'system-logs-block',
    name: 'System Logs',
    config: {
      type: 'data-group',
      props: {
        resource: systemLogsResource,
        showHeader:false,
        layout: systemLogsResource.layout,
        useApi: false,
        initialData: initialSystemLogsData
      }
    }
  }
];

// Layout Configuration
export const layout = [
  { name: 'Application Metrics', rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 12 }, // Moved Application Metrics to the top
  { name: 'User Management', rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 6 }, // User Management
  { name: 'System Logs', rowStart: 2, colStart: 7, rowSpan: 1, colSpan: 6 }, // System Logs side by side with User Management
  { name: 'Module Management', rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 6 }
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
