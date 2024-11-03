import { translationKeys } from '@/Localization/International/english';
import * as Yup from 'yup';

// Initial Data for Injuries
const initialInjuryData = [
  {
    incidentType: "NEAR_MISS",
    location: "Block A - Floor 2",
    reportedBy: "John Smith",
    date: "2024-04-27",
    description: "Unsecured tool nearly fell from scaffolding",
    actionTaken: "Additional safety briefing conducted",
    status: "RESOLVED"
  },
  {
    incidentType: "MINOR_INJURY",
    location: "Material Storage Area",
    reportedBy: "Maria Garcia",
    date: "2024-04-26",
    description: "Minor cut while handling materials",
    actionTaken: "First aid administered, PPE requirements reviewed",
    status: "CLOSED"
  }
];

// Initial Data for Reports
const initialReportData = [
  {
    reportName: "Weekly Progress",
    date: "2024-04-30",
    summary: "Overall progress is on track.",
    status: "COMPLETED"
  },
  {
    reportName: "Safety Audit",
    date: "2024-04-28",
    summary: "No major issues found.",
    status: "COMPLETED"
  }
];

// Initial Data for Material Inquiries
const initialMaterialInquiryData = [
  {
    materialName: "Cement",
    inquiryDate: "2024-04-27",
    quantityRequested: 100,
    status: "PENDING"
  },
  {
    materialName: "Bricks",
    inquiryDate: "2024-04-26",
    quantityRequested: 2000,
    status: "COMPLETED"
  }
];

// Initial Data for Projects
const initialProjectData = [
  {
    projectName: "Project Alpha",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "ON_TRACK"
  },
  {
    projectName: "Project Beta",
    startDate: "2024-02-01",
    endDate: "2024-11-30",
    status: "DELAYED"
  }
];

// Chart Data
const progressChartData = {
  weekly: [
    {
      name: 'Planned Progress',
      data: [
        { x: 'Week 1', y: 20 },
        { x: 'Week 2', y: 35 },
        { x: 'Week 3', y: 50 },
        { x: 'Week 4', y: 65 }
      ]
    },
    {
      name: 'Actual Progress',
      data: [
        { x: 'Week 1', y: 18 },
        { x: 'Week 2', y: 31 },
        { x: 'Week 3', y: 48 },
        { x: 'Week 4', y: 62 }
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

// Injuries Resource
const injuriesResource = {
  name: "Injuries",
  path: "injuries",
  icon: "pi pi-exclamation-triangle",
  label: translationKeys.Injuries || "Injuries",
  menuGroup: translationKeys.Safety || "Safety",
  menuGroupIcon: "pi pi-shield",
  schema: [
    {
      name: "incidentType",
      title: translationKeys.IncidentType || "Incident Type",
      type: "text",
      validation: Yup.string().required("Incident type is required"),
    },
    {
      name: "location",
      title: translationKeys.Location || "Location",
      type: "text",
      validation: Yup.string().required("Location is required"),
    },
    {
      name: "reportedBy",
      title: translationKeys.ReportedBy || "Reported By",
      type: "text",
      validation: Yup.string().required("Reporter is required"),
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
      incidentType: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      location: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      reportedBy: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      date: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Reports Resource
const reportsResource = {
  name: "Reports",
  path: "reports",
  icon: "pi pi-file",
  label: translationKeys.Reports || "Reports",
  menuGroup: translationKeys.Documents || "Documents",
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

// Material Inquiries Resource
const materialInquiriesResource = {
  name: "Material Inquiries",
  path: "material-inquiries",
  icon: "pi pi-box",
  label: translationKeys.MaterialInquiries || "Material Inquiries",
  menuGroup: translationKeys.Resources || "Resources",
  menuGroupIcon: "pi pi-truck",
  schema: [
    {
      name: "materialName",
      title: translationKeys.MaterialName || "Material",
      type: "text",
      validation: Yup.string().required("Material name is required"),
    },
    {
      name: "inquiryDate",
      title: translationKeys.InquiryDate || "Inquiry Date",
      type: "date",
      validation: Yup.date().required("Inquiry date is required"),
    },
    {
      name: "quantityRequested",
      title: translationKeys.QuantityRequested || "Quantity Requested",
      type: "number",
      validation: Yup.number().min(0).required("Quantity is required"),
    },
    {
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "Pending", value: "PENDING", color: "#ffc107" },
        { label: "Completed", value: "COMPLETED", color: "#28a745" }
      ],
      validation: Yup.string().required("Status is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      materialName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      inquiryDate: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      quantityRequested: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Projects Resource
const projectsResource = {
  name: "Projects",
  path: "projects",
  icon: "pi pi-briefcase",
  label: translationKeys.Projects || "Projects",
  menuGroup: translationKeys.Management || "Management",
  menuGroupIcon: "pi pi-cog",
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
      name: "status",
      title: translationKeys.Status || "Status",
      type: "status",
      options: [
        { label: "On Track", value: "ON_TRACK", color: "#28a745" },
        { label: "Delayed", value: "DELAYED", color: "#dc3545" }
      ],
      validation: Yup.string().required("Status is required"),
    }
  ],
  layout: {
    rows: 2,
    columns: 3,
    fields: {
      projectName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
      startDate: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
      endDate: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 }
    }
  }
};

// Block Configurations
export const blockConfigs = [
  {
    id: 'injuries-block',
    name: 'Injuries',
    config: {
      type: 'data-group',
      props: {
        resource: injuriesResource,
        showHeader:false,
        layout: injuriesResource.layout,
        useApi: false,
        initialData: initialInjuryData
      }
    }
  },
  {
    id: 'reports-block',
    name: 'Reports',
    config: {
      type: 'data-group',
      props: {
        resource: reportsResource,
        showHeader:false,
        layout: reportsResource.layout,
        useApi: false,
        initialData: initialReportData
      }
    }
  },
  {
    id: 'material-inquiries-block',
    name: 'Material Inquiries',
    config: {
      type: 'data-group',
      props: {
        resource: materialInquiriesResource,
        showHeader:false,
        layout: materialInquiriesResource.layout,
        useApi: false,
        initialData: initialMaterialInquiryData
      }
    }
  },
  {
    id: 'projects-block',
    name: 'Projects',
    config: {
      type: 'data-group',
      props: {
        resource: projectsResource,
        showHeader:false,
        layout: projectsResource.layout,
        useApi: false,
        initialData: initialProjectData
      }
    }
  },
  {
    id: 'progress-chart',
    name: 'Progress Chart',
    config: {
      type: 'chart',
      props: {
        chartType: 'line',
        series: progressChartData.weekly,
        chartTitle: 'Construction Progress Tracking',
        xAxisTitle: 'Timeline',
        yAxisTitle: 'Completion (%)',
        dataLabels: true,
        colors: ['#0088FE', '#00C49F'],
        height: 350,
        initialData: progressChartData
      }
    }
  },
  {
    id: 'status-pie-chart',
    name: 'Project Status',
    config: {
      type: 'chart',
      props: {
        chartType: 'pie',
        series: progressChartData.pie,
        chartTitle: 'Project Status Distribution',
        height: 350,
        initialData: progressChartData
      }
    }
  }
];

// Layout Configuration
export const layout = [
  { name: 'Injuries', rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 6 },
  { name: 'Reports', rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 6 },
  { name: 'Material Inquiries', rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 6 },
  { name: 'Projects', rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 6 },
  { name: 'Progress Chart', rowStart: 1, colStart: 7, rowSpan: 2, colSpan: 6 },
  { name: 'Project Status Pie Chart', rowStart: 3, colStart: 7, rowSpan: 2, colSpan: 6 }
];

// Dashboard Configuration
export const dashboardConfig = {
  title: "Project Manager Dashboard",
  refreshInterval: 300000, // 5 minutes
  allowExport: true,
  exportFormats: ['pdf', 'excel'],
  notifications: {
    enabled: true,
    position: 'top-right',
    defaultDuration: 5000,
    types: {
      injury: {
        icon: 'pi pi-exclamation-triangle',
        severity: 'danger'
      },
      report: {
        icon: 'pi pi-file',
        severity: 'info'
      },
      material: {
        icon: 'pi pi-info-circle',
        severity: 'info'
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