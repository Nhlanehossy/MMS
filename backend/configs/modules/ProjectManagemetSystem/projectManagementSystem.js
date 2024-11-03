

exports.construction_tracking_system = [
  {
    name: "projects",
    icon: "fa fa-building",
    label: "Projects",
    menuGroup: "Projects",
    menuGroupIcon: "fa fa-folder",
    schema: [
      {
        name: "projectName",
        title: "Project Name",
        type: "text",
      },

      {
        name: "startDate",
        title: "Start Date",
        type: "date",

      },
      {
        name: "expectedEndDate",
        title: "Expected Completion Date",
        type: "date",

      },
      {
        name: "location",
        title: "Location",
        type: "text",
  
      },


      {
        name:"client",
        type: "ref",
        resource: "users",
        field: "fullname",
      },

      
      {
        name: "milestones",
        type: "select",
        options: [
          { label: "Planning & Permits", value: "planning", color: "#007bff" },
          { label: "Site Preparation", value: "site_preparation", color: "#6c757d" },
          { label: "Foundation", value: "foundation", color: "#7952b3" },
          { label: "Framing", value: "framing", color: "#17a2b8" },
          { label: "Roofing", value: "roofing", color: "#ffc107" },
          { label: "Windows & Doors", value: "windows_doors", color: "#dc3545" },
          { label: "Rough-In", value: "rough_in", color: "#28a745" }, // Plumbing, Electrical, HVAC
          { label: "Insulation", value: "insulation", color: "#20c997" },
          { label: "Drywall", value: "drywall", color: "#fd7e14" },
          { label: "Interior Finishes", value: "interior_finishes", color: "#343a40" }, // Paint, Cabinets, Trim
          { label: "Exterior Finishes", value: "exterior_finishes", color: "#17c0eb" }, // Siding, Landscaping
          { label: "Final Inspection", value: "final_inspection", color: "#6610f2" },
          { label: "Handover", value: "handover", color: "#e83e8c" } // Completion & Client Walkthrough
        ],
      },
      {
        name: "teams",
        title: "Teams",
        type: "tags",
        tagInputType: "refs",
        resource: "teams",
        field: "teamName",

      },

      {
        name: "description",
        title: "Description",
        type: "richtext",

      },


      {
        name: "documents",
        title: "Project Documents",
        type: "object array",
        schema: [


          {
            name: "file",
            title: "File",
            type: "document"
          }
        ]
      }
        
      // In the projects schema array, add this field:
  ],
    layout:{
        rows:8,
        columns:8,
        fields: {
          projectName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
          projectCode: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
          startDate: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
          expectedEndDate: { rowStart: 1, colStart: 4, rowSpan: 1, colSpan: 1 },
          location: { rowStart: 1, colStart: 5, rowSpan: 1, colSpan: 1 },
          status: { rowStart: 1, colStart: 6, rowSpan: 1, colSpan: 1 },
          teams: { rowStart: 1, colStart: 7, rowSpan: 1, colSpan: 1 },
          milestones: { rowStart: 1, colStart: 8, rowSpan: 1, colSpan: 1 },
          projectManager: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
          description: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 6 },
          attachments: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 8 },
        }
    },
    renderMode: "crud",
 },



  {
    name: "teams",
    icon: "fa fa-users",
    label: "Teams",
    menuGroup: "Projects",
    menuGroupIcon: "fa fa-folder",
    schema: [
      {
        name: "teamName",
        title: "Team Name",
        type: "text",

      },
      {
        name: "teamLead",
        title: "Team Lead",
        type: "ref",
        resource: "users",

      },
      {
        name: "members",
        title: "Team Members",
        type: "tags",
        tagInputType: "refs",
        resource: "users",
        field: "fullname",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",

      },
    ],
    layout:{
        rows:5,
        columns:2,
        fields: {
            teamName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
            teamLead: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
            members: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 },
            description: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 2 },
            teamMembers: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 2 },
        }
    },
    renderMode: "crud",

  },
  {
    name: "budget",
    icon: "fa fa-money-bill",
    label: "Budget",
    menuGroup: "Finance",
    menuGroupIcon: "fa fa-dollar-sign",
    schema: [
      {
        name: "project",
        title: "Project",
        type: "ref",
        resource: "projects",
        field: "projectName",

      },
      {
        name: "totalBudget",
        title: "Total Budget",
        type: "number",
      },
      {
        name: "spentAmount",
        title: "Spent Amount",
        type: "number",
      },
      {
        name: "remainingAmount",
        title: "Remaining Amount",
        type: "number",
      },
      {
        name: "currency",
        title: "Currency",
        type: "text",
      },
      {
        name: "lastUpdated",
        title: "Last Updated",
        type: "date",
      },
      {
        name: "notes",
        title: "Notes",
        type: "richtext",
      },
    ],
    layout:{
        rows:8,
        columns:2,
        fields:{
            projectName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
            totalBudget: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
            spentAmount: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 1 },
            remainingAmount: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 1 },
            currency: { rowStart: 5, colStart: 1, rowSpan: 1, colSpan: 1 },
            lastUpdated: { rowStart: 6, colStart: 1, rowSpan: 1, colSpan: 1 },
            notes: { rowStart: 7, colStart: 1, rowSpan: 1, colSpan: 1 },
        }
    },
    renderMode: "crud",
  },

  {
    name: "tasks",
    icon: "fa fa-tasks",
    label: "Tasks",
    menuGroup: "Projects",
    menuGroupIcon: "fa fa-folder",
    schema: [
      {
        name: "taskName",
        title: "Task Name",
        type: "text",
      },
      {
        name: "team",
        title: "Assigned Team",
        type: "ref",
        resource: "teams",
        field: "teamName",
      },
      {
        name: "startDate",
        title: "Start Date",
        type: "date",

      },
      {
        name: "dueDate",
        title: "Due Date",
        type: "date",

      },
      {
        name: "priority",
        title: "Priority",
        type: "status",
        options: [
          { label: "Low", value: "low", color: "#FFD700" },
          { label: "Medium", value: "medium", color: "#007ACC" },
          { label: "High", value: "high", color: "#008000" },
          { label: "Critical", value: "critical", color: "#FF6347" },
        ],
      },
      {
        name: "status",
        title: "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "In Progress", value: "inProgress", color: "#007ACC" },
          { label: "Completed", value: "completed", color: "#008000" },
          { label: "Failed", value: "failed", color: "#FF6347" },
          { label: "On Hold", value: "onHold", color: "#008080" },
        ],

      },
      {
        name: "description",
        title: "Description",
        type: "richtext",

      },
      {
        name: "attachments",
        title: "Attachments",
        type: "file",
      },
    ],
    layout: {
      rows:8,
      columns:6,
      fields:{
        taskName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
        team: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 1 },
        startDate: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
        dueDate: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 1 },
        priority: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 1 },
        status: { rowStart: 3, colStart: 2, rowSpan: 1, colSpan: 1 },
        description: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 2 },
        attachments: { rowStart: 5, colStart: 1, rowSpan: 1, colSpan: 2 },
      }
      
    },
    renderMode: "crud",
  },
  {
    name: "injuries",
    path: "injuries",
    icon: "pi pi-exclamation-triangle",
    menuGroupIcon: "pi pi-shield",
    renderMode: "crud",
    schema: [
      {
        name: "incidentType",
        type: "select",
        options: [
            { label: "Slip and Fall", value: "slip_fall" },
            { label: "Equipment Malfunction", value: "equipment_malfunction" },
            { label: "Fire Hazard", value: "fire_hazard" },
            { label: "Chemical Exposure", value: "chemical_exposure" },
            { label: "Electrical Shock", value: "electrical_shock" },
            { label: "Cuts and Lacerations", value: "cuts_lacerations" }
        ],
      },
      {
        name:"project",
        type: "ref",
        resource: "projects",
        field: "projectName",
      },
      {
        name: "location",
        type: "text",
  
      },
       {
        name: "severity",
        type: "status",
        options: [
            { label: "Low", value: "low", color: "#FFD700" },
            { label: "Medium", value: "medium", color: "#007ACC" },
            { label: "High", value: "high", color: "#008000" },
            { label: "Critical", value: "critical", color: "#FF6347" }
        ],
      },          
      {
        name: "date",
        type: "date",
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
},

{
    name: "material_inquiries",
    path: "material_inquiries",
    icon: "pi pi-box",
    menuGroupIcon: "pi pi-archive",
    renderMode: "crud",
    schema: [
      {
        name: "materialName",
        type: "text",
      },
      {
        name: "quantity",
        type: "number",
       
    },
      {
        name: "inquiryDate",
        type: "date",
      },
      {
        name: "status",

        type: "status",
        options: [
            { label: "Pending", value: "pending", color: "#FFD700" },
            { label: "Approved", value: "approved", color: "#007ACC" },
            { label: "Declined", value: "declined", color: "#008000" }
        ],

      }
    ],
    layout: {
      rows: 3,
      columns: 3,
      fields: {
        materialName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
        supplier: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
        quantity: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
        inquiryDate: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 2 },
        status: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 3 }
      }
    }
},
{
    name: "reports",
    path: "reports",
    icon: "pi pi-calendar",
    menuGroupIcon: "pi pi-briefcase",
    renderMode: "crud",
    schema: [
      {
        name:"type",
        type: "select",
        options: [
            { label: "Weekly Report", value: "weeklyReport" },
            { label: "Monthly Report", value: "monthlyReport" },
            { label: "Daily Report", value: "dailyReport" },
            { label: "Annual Report", value: "annualReport" }
        ]
      },

      {
        name: "supervisor",
        type: "text",
      },
      {
        name: "weatherConditions",
        type: "select",
        options: [
            { label: "Sunny", value: "sunny" },
            { label: "Cloudy", value: "cloudy" },
            { label: "Rainy", value: "rainy" },
            { label: "Stormy", value: "stormy" }
        ],
      },
      {
        name: "workCompleted",
        type: "richtext",
      },
      {
        name: "issues",
        type: "richtext",
      },
      {
        name: "safetyIncidents",
        type: "select",
        options: [
            { label: "None", value: "none" },
            { label: "Minor", value: "minor" },
            { label: "Major", value: "major" }
        ],
      }
    ],
    layout: {
      rows: 3,
      columns: 3,
      fields: {
        reportDate: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
        supervisor: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 2 },
        weatherConditions: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
        workCompleted: { rowStart: 2, colStart: 2, rowSpan: 1, colSpan: 2 },
        issues: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 2 },
        safetyIncidents: { rowStart: 3, colStart: 3, rowSpan: 1, colSpan: 1 }
      }
    }
}
];
