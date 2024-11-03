import { translationKeys } from '@/Localization/International/english';
import * as Yup from 'yup';

// Initial Data for Project Milestones
const initialMilestoneData = [
  {
    milestoneName: "Project Kickoff",
    dueDate: "2024-01-15",
    status: "COMPLETED",
    notes: "Successfully completed the kickoff meeting."
  },
  {
    milestoneName: "Phase 1 Completion",
    dueDate: "2024-03-01",
    status: "IN_PROGRESS",
    notes: "On track for completion."
  },
  {
    milestoneName: "Phase 2 Completion",
    dueDate: "2024-06-01",
    status: "PENDING",
    notes: "Pending completion of Phase 1."
  }
];

// Initial Data for Project Status
const initialProjectStatusData = [
  {
    projectName: "Project Alpha",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    overallStatus: "ON_TRACK",
    completionPercentage: 45
  },
  {
    projectName: "Project Beta",
    startDate: "2024-02-01",
    endDate: "2024-11-30",
    overallStatus: "DELAYED",
    completionPercentage: 30
  }
];

// Initial Data for Key Metrics
const initialKeyMetricsData = [
  {
    metricName: "Total Budget",
    value: "MWK500,000",
    icon: "pi pi-dollar"
  },
  {
    metricName: "Total Expenses",
    value: "MWK200,000",
    icon: "pi pi-money-bill"
  },
  {
    metricName: "Total Revenue",
    value: "MWK300,000",
    icon: "pi pi-shopping-cart"
  },
  {
    metricName: "Remaining Budget",
    value: "MWK300,000",
    icon: "pi pi-dollar"
  }
];

// Initial Data for Expenses and Revenues
const initialFinancialData = [
  {
    source: "Product Sales",
    amount: 200000,
    date: "2024-04-30",
    icon: "pi pi-shopping-cart" // Added icon field
  },
  {
    source: "Service Income",
    amount: 50000,
    date: "2024-04-30",
    icon: "pi pi-briefcase" // Added icon field
  },
  {
    expenseName: "Office Supplies",
    amount: 1500,
    date: "2024-04-15",
    status: "APPROVED",
    icon: "pi pi-pencil" // Added icon field
  },
  {
    expenseName: "Travel Expenses",
    amount: 3000,
    date: "2024-04-20",
    status: "PENDING",
    icon: "pi pi-plane" // Added icon field
  }
];

// Chart Data
const projectProgressChartData = {
  monthly: [
    {
      name: 'Planned Progress',
      data: [
        { x: 'January', y: 20 },
        { x: 'February', y: 35 },
        { x: 'March', y: 50 },
        { x: 'April', y: 65 }
      ]
    },
    {
      name: 'Actual Progress',
      data: [
        { x: 'January', y: 18 },
        { x: 'February', y: 31 },
        { x: 'March', y: 48 },
        { x: 'April', y: 62 }
      ]
    }
  ],
  pie: [
    {
      name: 'Completed',
      value: 70
    },
    {
      name: 'In Progress',
      value: 20
    },
    {
      name: 'Delayed',
      value: 10
    }
  ]
};

// Milestones Resource
const milestonesResource = {
  name: "Milestones",
  path: "milestones",
  icon: "pi pi-flag",
  label: translationKeys.Milestones || "Milestones",
  menuGroup: translationKeys.Projects || "Projects",
  menuGroupIcon: "pi pi-briefcase",
  schema: [
    {
      name: "milestoneName",
      title: translationKeys.MilestoneName || "Milestone Name",
      type: "text",
      validation: Yup.string().required("Milestone name is required"),
    },
    {
      name: "dueDate",
      title: translationKeys.DueDate || "Due Date",
      type: "date",
      validation: Yup.date().required("Due date is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "Completed", value: "COMPLETED", color: "#28a745" },
        { label: "In Progress", value: "IN_PROGRESS", color: "#007bff" },
        { label: "Pending", value: "PENDING", color: "#ffc107" }
      ],
      validation: Yup.string().required("Status is required"),
    },
    {
      name: "notes",
      title: translationKeys.Notes || "Notes",
      type: "text",
      validation: Yup.string().required("Notes are required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 2, // Reduced from 3 to 2
    fields: {
      milestoneName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      dueDate: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
      notes: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1 } // Adjusted to fit new layout
    }
  }
};

// Project Status Resource
const projectStatusResource = {
  name: "Project Status",
  path: "project-status",
  icon: "pi pi-chart-line",
  label: translationKeys.ProjectStatus || "Project Status",
  menuGroup: translationKeys.Projects || "Projects",
  menuGroupIcon: "pi pi-briefcase",
  schema: [
    {
      name: "projectName",
      title: translationKeys.ProjectName || "Project Name",
      type: "text",
      validation: Yup.string().required("Project name is required"),
    },
    {
      name: "startDate",
      title: translationKeys.StartDate || "Start Date",
      type: "date",
      validation: Yup.date().required("Start date is required"),
    },
    {
      name: "endDate",
      title: translationKeys.EndDate || "End Date",
      type: "date",
      validation: Yup.date().required("End date is required"),
    },
    {
      name: "overallStatus",
      title: translationKeys.OverallStatus || "Overall Status",
      type: "status",
      options: [
        { label: "On Track", value: "ON_TRACK", color: "#28a745" },
        { label: "Delayed", value: "DELAYED", color: "#dc3545" }
      ],
      validation: Yup.string().required("Overall status is required"),
    },
    {
      name: "completionPercentage",
      title: translationKeys.CompletionPercentage || "Completion Percentage",
      type: "number",
      validation: Yup.number().min(0).max(100).required("Completion percentage is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      projectName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      startDate: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      endDate: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      overallStatus: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
      completionPercentage: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1 }
    }
  }
};

// Key Metrics Resource
const keyMetricsResource = {
  name: "Key Metrics",
  path: "key-metrics",
  icon: "pi pi-chart-bar",
  label: translationKeys.KeyMetrics || "Key Metrics",
  menuGroup: translationKeys.Metrics || "Metrics",
  menuGroupIcon: "pi pi-chart-line",
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
      name: "icon",
      title: translationKeys.Icon || "Icon",
      type: "icon",
      validation: Yup.string().required("Icon is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 2,
    fields: {
      metricName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      value: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      icon: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Financial Summary Resource
const financialSummaryResource = {
  name: "Financial Summary",
  path: "financial-summary",
  icon: "pi pi-money-bill",
  label: translationKeys.FinancialSummary || "Financial Summary",
  menuGroup: translationKeys.Finance || "Finance",
  menuGroupIcon: "pi pi-dollar",
  schema: [
    {
      name: "source",
      title: translationKeys.Source || "Source",
      type: "text",
      validation: Yup.string().required("Source is required"),
    },
    {
      name: "amount",
      title: translationKeys.Amount || "Amount",
      type: "number",
      validation: Yup.number().required("Amount is required"),
    },
    {
      name: "date",
      title: translationKeys.Date || "Date",
      type: "date",
      validation: Yup.date().required("Date is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "Approved", value: "APPROVED", color: "#28a745" },
        { label: "Pending", value: "PENDING", color: "#ffc107" }
      ],
      validation: Yup.string().required("Status is required"),
    },
    {
      name: "icon", // Added icon field
      title: translationKeys.Icon || "Icon",
      type: "icon",
      validation: Yup.string().required("Icon is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      source: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      amount: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      date: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Block Configurations
export const blockConfigs = [
  {
    id: 'milestones-block',
    name: 'Milestones',
    config: {
      type: 'data-group',
      props: {
        resource: milestonesResource,
        showHeader:false,
        layout: milestonesResource.layout,
        useApi: false,
        initialData: initialMilestoneData
      }
    }
  },
  {
    id: 'project-status-block',
    name: 'Project Status',
    config: {
      type: 'data-group',
      props: {
        resource: projectStatusResource,
        showHeader:false,
        layout: projectStatusResource.layout,
        useApi: false,
        initialData: initialProjectStatusData
      }
    }
  },
  {
    id: 'key-metrics-block',
    name: 'Key Metrics',
    config: {
      type: 'data-group',
      props: {
        resource: keyMetricsResource,
        showHeader:false,
        displayMode: 'grid',
        layout: keyMetricsResource.layout,
        useApi: false,
        initialData: initialKeyMetricsData
      }
    }
  },
  {
    id: 'financial-summary-block',
    name: 'Financial Summary',
    config: {
      type: 'data-group',
      props: {
        resource: financialSummaryResource,
        showHeader:false,
        layout: financialSummaryResource.layout,
        useApi: false,
        initialData: initialFinancialData
      }
    }
  },
  {
    id: 'project-progress-chart',
    name: 'Project Progress',
    config: {
      type: 'chart',
      props: {
        chartType: 'line',
        series: projectProgressChartData.monthly,
        chartTitle: 'Project Progress Tracking',
        xAxisTitle: 'Month',
        yAxisTitle: 'Completion (%)',
        dataLabels: true,
        colors: ['#0088FE', '#00C49F'],
        height: 350,
        initialData: projectProgressChartData
      }
    }
  },

  
];
// Layout Configuration
export const layout = [
  { name: 'Key Metrics', rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 18 },
  { name: 'Milestones', rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 7 },
  { name: 'Project Progress', rowStart: 2, colStart: 8, rowSpan: 2, colSpan: 11 },
  { name: 'Project Status Distribution', rowStart: 3, colStart: 8, rowSpan: 2, colSpan: 11 }
];

// Dashboard Configuration
export const dashboardConfig = {
  title: "Client Project Dashboard",
  refreshInterval: 300000, // 5 minutes
  allowExport: true,
  exportFormats: ['pdf', 'excel'],
  notifications: {
    enabled: true,
    position: 'top-right',
    defaultDuration: 5000,
    types: {
      milestone: {
        icon: 'pi pi-flag',
        severity: 'info'
      },
      status: {
        icon: 'pi pi-chart-line',
        severity: 'success'
      },
      financial: {
        icon: 'pi pi-money-bill',
        severity: 'warning'
      }
    }
  },
  filters: {
    enabled: true,
    defaultFilters: ['date', 'status'],
    customFilters: [
      {
        name: 'project',
        type: 'select',
        options: ['Project Alpha', 'Project Beta']
      },
      {
        name: 'milestone',
        type: 'select',
        options: ['Project Kickoff', 'Phase 1 Completion', 'Phase 2 Completion']
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
