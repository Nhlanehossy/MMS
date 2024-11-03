import { translationKeys } from '@/Localization/International/english';
import * as Yup from 'yup';

// Initial Data for Financial Reports
const initialFinancialReportsData = [
  {
    reportName: "Monthly Financial Overview",
    date: "2024-04-30",
    summary: "Overall financial health is stable.",
    status: "COMPLETED"
  },
  {
    reportName: "Quarterly Budget Review",
    date: "2024-03-31",
    summary: "Budget on track with minor adjustments needed.",
    status: "COMPLETED"
  }
];

// Initial Data for Budget Tracking
const initialBudgetData = [
  {
    category: "Marketing",
    budgetedAmount: 50000,
    actualAmount: 45000,
    status: "ON_TRACK"
  },
  {
    category: "Operations",
    budgetedAmount: 100000,
    actualAmount: 120000,
    status: "OVER_BUDGET"
  }
];

// Initial Data for Expense Tracking
const initialExpenseData = [
  {
    expenseName: "Office Supplies",
    amount: 1500,
    date: "2024-04-15",
    status: "APPROVED"
  },
  {
    expenseName: "Travel Expenses",
    amount: 3000,
    date: "2024-04-20",
    status: "PENDING"
  }
];

// Initial Data for Revenue Tracking
const initialRevenueData = [
  {
    source: "Product Sales",
    amount: 200000,
    date: "2024-04-30"
  },
  {
    source: "Service Income",
    amount: 50000,
    date: "2024-04-30"
  }
];

// Chart Data
const financialChartData = {
  monthly: [
    {
      name: 'Revenue',
      data: [
        { x: 'January', y: 150000 },
        { x: 'February', y: 180000 },
        { x: 'March', y: 200000 },
        { x: 'April', y: 250000 }
      ]
    },
    {
      name: 'Expenses',
      data: [
        { x: 'January', y: 120000 },
        { x: 'February', y: 130000 },
        { x: 'March', y: 140000 },
        { x: 'April', y: 160000 }
      ]
    }
  ],
  pie: [
    {
      name: 'Revenue Sources',
      value: 70
    },
    {
      name: 'Expenses',
      value: 30
    }
  ]
};

// Financial Reports Resource
const financialReportsResource = {
  name: "Financial Reports",
  path: "financial-reports",
  icon: "pi pi-file",
  label: translationKeys.FinancialReports || "Financial Reports",
  menuGroup: translationKeys.Reports || "Reports",
  menuGroupIcon: "pi pi-folder",
  schema: [
    {
      name: "reportName",
      title: translationKeys.ReportName || "Report Name",
      type: "text",
      validation: Yup.string().required("Report name is required"),
    },
    {
      name: "date",
      title: translationKeys.Date || "Date",
      type: "date",
      validation: Yup.date().required("Date is required"),
    },
    {
      name: "summary",
      title: translationKeys.Summary || "Summary",
      type: "text",
      validation: Yup.string().required("Summary is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "Completed", value: "COMPLETED", color: "#28a745" },
        { label: "Pending", value: "PENDING", color: "#ffc107" },
        { label: "Delayed", value: "DELAYED", color: "#dc3545" }
      ],
      validation: Yup.string().required("Status is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      reportName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      date: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      summary: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Budget Tracking Resource
const budgetTrackingResource = {
  name: "Budget Tracking",
  path: "budget-tracking",
  icon: "pi pi-chart-bar",
  label: translationKeys.BudgetTracking || "Budget Tracking",
  menuGroup: translationKeys.Finance || "Finance",
  menuGroupIcon: "pi pi-dollar",
  schema: [
    {
      name: "category",
      title: translationKeys.Category || "Category",
      type: "text",
      validation: Yup.string().required("Category is required"),
    },
    {
      name: "budgetedAmount",
      title: translationKeys.BudgetedAmount || "Budgeted Amount",
      type: "number",
      validation: Yup.number().required("Budgeted amount is required"),
    },
    {
      name: "actualAmount",
      title: translationKeys.ActualAmount || "Actual Amount",
      type: "number",
      validation: Yup.number().required("Actual amount is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "On Track", value: "ON_TRACK", color: "#28a745" },
        { label: "Over Budget", value: "OVER_BUDGET", color: "#dc3545" }
      ],
      validation: Yup.string().required("Status is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      category: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      budgetedAmount: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      actualAmount: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Expense Tracking Resource
const expenseTrackingResource = {
  name: "Expense Tracking",
  path: "expense-tracking",
  icon: "pi pi-money-bill",
  label: translationKeys.ExpenseTracking || "Expense Tracking",
  menuGroup: translationKeys.Finance || "Finance",
  menuGroupIcon: "pi pi-dollar",
  schema: [
    {
      name: "expenseName",
      title: translationKeys.ExpenseName || "Expense Name",
      type: "text",
      validation: Yup.string().required("Expense name is required"),
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
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      expenseName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      amount: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      date: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Revenue Tracking Resource
const revenueTrackingResource = {
  name: "Revenue Tracking",
  path: "revenue-tracking",
  icon: "pi pi-dollar",
  label: translationKeys.RevenueTracking || "Revenue Tracking",
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
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      source: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      amount: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      date: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 }
    }
  }
};

// Block Configurations
export const blockConfigs = [
  {
    id: 'financial-reports-block',
    name: 'Financial Reports',
    config: {
      type: 'data-group',
      props: {
        resource: financialReportsResource,
        showHeader:false,
        layout: financialReportsResource.layout,
        useApi: false,
        initialData: initialFinancialReportsData
      }
    }
  },
  {
    id: 'budget-tracking-block',
    name: 'Budget Tracking',
    config: {
      type: 'data-group',
      props: {
        resource: budgetTrackingResource,
        showHeader:false,
        layout: budgetTrackingResource.layout,
        useApi: false,
        initialData: initialBudgetData
      }
    }
  },
  {
    id: 'expense-tracking-block',
    name: 'Expense Tracking',
    config: {
      type: 'data-group',
      props: {
        resource: expenseTrackingResource,
        showHeader:false,
        layout: expenseTrackingResource.layout,
        useApi: false,
        initialData: initialExpenseData
      }
    }
  },
  {
    id: 'revenue-tracking-block',
    name: 'Revenue Tracking',
    config: {
      type: 'data-group',
      props: {
        resource: revenueTrackingResource,
        showHeader:false,
        layout: revenueTrackingResource.layout,
        useApi: false,
        initialData: initialRevenueData
      }
    }
  },
  {
    id: 'financial-line-chart',
    name: 'Financial Overview',
    config: {
      type: 'chart',
      props: {
        chartType: 'line',
        series: financialChartData.monthly,
        chartTitle: 'Monthly Revenue vs Expenses',
        xAxisTitle: 'Month',
        yAxisTitle: 'Amount ($)',
        dataLabels: true,
        colors: ['#0088FE', '#FF5733'],
        height: 350,
        initialData: financialChartData
      }
    }
  },
  {
    id: 'revenue-pie-chart',
    name: 'Revenue Sources',
    config: {
      type: 'chart',
      props: {
        chartType: 'pie',
        series: financialChartData.pie,
        chartTitle: 'Revenue Sources Distribution',
        height: 350,
        initialData: financialChartData
      }
    }
  }
];

// Enhanced Layout Configuration
export const layout = [
  // Header section covering full width  
  // Two sections on the left side
  { name: 'Financial Reports', rowStart: 3, colStart: 1, rowSpan: 2, colSpan: 8 },
  { name: 'Budget Tracking', rowStart: 5, colStart: 1, rowSpan: 2, colSpan: 8 },
  
  // Center section (reduced height widget)
  { name: 'Expense Tracking', rowStart: 3, colStart: 9, rowSpan: 2, colSpan: 8 },
  
  // Financial chart in the middle
  { name: 'Financial Overview', rowStart: 5, colStart: 9, rowSpan: 2, colSpan: 8 },
  
  // A smaller widget at the bottom right corner
  { name: 'Profit Analysis', rowStart: 7, colStart: 9, rowSpan: 1, colSpan: 8 }
];


// Dashboard Configuration
export const dashboardConfig = {
  title: "Finance Manager Dashboard",
  refreshInterval: 300000, // 5 minutes
  allowExport: true,
  exportFormats: ['pdf', 'excel'],
  notifications: {
    enabled: true,
    position: 'top-right',
    defaultDuration: 5000,
    types: {
      report: {
        icon: 'pi pi-file',
        severity: 'info'
      },
      budget: {
        icon: 'pi pi-chart-bar',
        severity: 'warning'
      },
      expense: {
        icon: 'pi pi-money-bill',
        severity: 'danger'
      }
    }
  },
  filters: {
    enabled: true,
    defaultFilters: ['date', 'status'],
    customFilters: [
      {
        name: 'category',
        type: 'select',
        options: ['Marketing', 'Operations', 'IT', 'HR']
      },
      {
        name: 'priority',
        type: 'select',
        options: ['High', 'Medium', 'Low']
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