import { translationKeys } from '@/Localization/International/english';
import * as Yup from 'yup';
import { Resources } from '../../../../data/resources';



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
const injuriesResource = Resources.find(resource => resource.path === "injuries");


// Material Inquiries Resource
const materialInquiriesResource = Resources.find(resource => resource.path === "material_inquiries");

// Projects Resource
const projectsResource = Resources.find(resource => resource.path === "projects");

// Block Configurations
export const blockConfigs = [
  {
    id: 'injuries-block',
    name: 'Injuries',
    title:'Today\'s Injuries',
    config: {
      type: 'data-group',
      props: {
        resource: injuriesResource,
        showHeader:false,
        layout: injuriesResource.layout,
        useApi: true,
        showMoreLink: true,
        maxDisplayItems:3
        
      }
    }
  },

  {
    id: 'material-inquiries-block',
    name: 'Material Inquiries',
    title:'Latest Material Inquiries',
    config: {
      type: 'data-group',
      props: {
        resource: materialInquiriesResource,
        displayMode:'grid',
        showHeader:false,
        layout: materialInquiriesResource.layout,
        useApi: true,
        showMoreLink: true,
        maxDisplayItems:3
      }
    }
  },
  {
    id: 'projects-block',
    name: 'Projects',
    title:'Current Projects',
    config: {
      type: 'data-group',
      props: {
        resource: projectsResource,
        showHeader:false,
        layout: projectsResource.layout,
        useApi: true,
        showMoreLink: true,
        maxDisplayItems:3
      }
    }
  },
  {
    id: 'progress-chart',
    name: 'Progress Chart',
    title:'Progress Chart',
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
  // Top Row - Split
  {
    name: 'Injuries',
    rowStart: 1,
    colStart: 1,
    rowSpan: 1,
    colSpan: 6
  },
  {
    name: 'Progress Chart',
    rowStart: 1,
    colStart: 7,
    rowSpan: 1,
    colSpan: 6
  },
 
  // Middle Row - Full Span
  {
    name: 'Material Inquiries',
    rowStart: 2,
    colStart: 1,
    rowSpan: 1,
    colSpan: 12
  },
 

  {
    name: 'Projects',
    rowStart: 3,
    colStart: 7,
    rowSpan: 1,
    colSpan: 6
  }
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