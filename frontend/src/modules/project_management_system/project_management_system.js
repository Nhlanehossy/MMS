import { v4 as uuidv4 } from "uuid";
import { translationKeys } from "@/executables/translation";
import * as Yup from "yup";

export const construction_tracking_system = [
  {
    name: "projects",
    path: "projects",
    icon: "pi pi-building",
    label: "Projects",

    schema: [
      {
        name: "projectName",
        title: "Project Name",
        type: "text",
        validation: Yup.string().required("Project Name is required."),
      },

      {
        name: "startDate",
        title: "Start Date",
        type: "date",
        validation: Yup.date().required("Start Date is required"),
      },
      {
        name: "expectedEndDate",
        title: "Expected Completion Date",
        type: "date",
        validation: Yup.date().required("Start Date is required"),
      },
      {
        name: "location",
        title: "Location",
        type: "text",
        validation: Yup.string().required("Location is required"),
      },
      {
        name:"client",
        type: "ref",
        title: translationKeys.Client || "Client",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("Client is required"),
      },
      {
        name: "milestones",
        title: translationKeys.Status || "Milestones",
        type: "status",
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
        validation: Yup.string().required("Milestone is required"),
      }
      ,
      {
        name: "description",
        title: "Description",
        type: "richtext",
        validation: Yup.string().required("Description is required"),
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
        

    ],
    renderMode: "kanban",
   layout: {
    rows: 2,
    columns: 5,
    fields: {
      projectName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
      status: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 4 },

    },
    actions: [
      {
        name: "user_actions",
        rowStart: 1,
        rowSpan: 1,
        colStart: 5,
        colSpan: 1,
        alignment: "top-right",
        actions: [
          { name: "goToView", icon: "pi pi-eye", label: "View" },
          { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
          { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
        ],
        orientation: "icons",
        style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
      },
    ],
  },
  },



  {
    name: "tasks",
    path: "tasks",
    icon: "pi pi-list",
    label: "Tasks",

    schema: [
      {
        name: "taskName",
        title: "Task Name",
        type: "text",
        validation: Yup.string().required("Task Name is required"),
      },
      {
        name: "team",
        title: "Assigned Team",
        type: "ref",
        resource: "teams",
        field: "teamName",
        validation: Yup.string().required("Assigned Team is required"),
      },
      {
        name: "startDate",
        title: "Start Date",
        type: "date",
        validation: Yup.date().required("Start Date is required"),
      },
      {
        name: "dueDate",
        title: "Due Date",
        type: "date",
        validation: Yup.date().required("Due Date is required"),
      },
      {
        name: "status",
        title: "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "In Progress", value: "inProgress", color: "#007ACC" },
          { label: "Completed", value: "completed", color: "#008000" },

        ],
        validation: Yup.string().required("Status is required"),
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
        validation: Yup.string().required("Priority is required"),
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
        validation: Yup.string().required("Description is required"),
      },
    ],
    layout: {
      rows: 3,
      columns: 4,
      fields: {
        taskName: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 4 },
        status: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 2 },
      },
      actions: [
        {
          name: "user_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 4,
          colSpan: 1,
          alignment: "top-right",
          actions: [
            { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
            { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
          ],
          orientation: "icons",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
    renderMode: "crud",
  },
  {
    name: "teams",
    path: "teams",
    icon: "pi pi-users",
    label: "Teams",

    schema: [
      {
        name: "teamName",
        title: "Team Name",
        type: "text",
        validation: Yup.string().required("Team Name is required"),
      },
      {
        name: "teamLead",
        title: "Team Lead",
        type: "ref",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("Team Lead is required"),
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
        validation: Yup.string().required("Description is required"),
      },
    ],
    layout: {
      rows: 3,
      columns: 2,
      fields: {
        teamName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
        members: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2 },
        teamMembers: { rowStart: 3, colStart: 1, rowSpan: 2, colSpan: 2 },
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
            { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
            { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
          ],
          orientation: "icons",
        },
      ],
    },
    renderMode: "crud",
  },
  {
    name: "budget",
    path: "budget",
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
        validation: Yup.string().required("Project is required"),
      },
      {
        name: "totalBudget",
        title: "Total Budget",
        type: "number",
        validation: Yup.number().required("Total Budget is required"),
      },
      {
        name: "spentAmount",
        title: "Spent Amount",
        type: "number",
        validation: Yup.number().required("Spent Amount is required"),
      },
      {
        name: "remainingAmount",
        title: "Remaining Amount",
        type: "number",
        validation: Yup.number().required("Remaining Amount is required"),
      },
      {
        name: "currency",
        title: "Currency",
        type: "text",
        validation: Yup.string().required("Currency is required"),
      },
      {
        name: "lastUpdated",
        title: "Last Updated",
        type: "date",
        validation: Yup.date().required("Last Updated is required"),
      },
      {
        name: "notes",
        title: "Notes",
        type: "richtext",
        validation: Yup.string().required("Notes is required"),
      },
    ],
    layout: {
      rows: 8,
      columns: 2,
      fields: {
        projectName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
        totalBudget: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
        spentAmount: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 1 },
        remainingAmount: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 1 },
        currency: { rowStart: 5, colStart: 1, rowSpan: 1, colSpan: 1 },
        lastUpdated: { rowStart: 6, colStart: 1, rowSpan: 1, colSpan: 1 },
        notes: { rowStart: 7, colStart: 1, rowSpan: 1, colSpan: 1 },
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
           
               { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
            { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
          ],
          orientation: "icons",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
    renderMode: "crud",
  },
  {
    name: "tasks",
    path: "my-tasks",
    icon: "pi pi-list",
    label: "My Tasks",

    schema: [
      {
        name: "taskName",
        title: "Task Name",
        type: "text",
        validation: Yup.string().required("Task Name is required"),
      },
      {
        name: "team",
        title: "Assigned Team",
        type: "ref",
        resource: "teams",
        field: "teamName",
        validation: Yup.string().required("Assigned Team is required"),
      },
      {
        name: "startDate",
        title: "Start Date",
        type: "date",
        validation: Yup.date().required("Start Date is required"),
      },
      {
        name: "dueDate",
        title: "Due Date",
        type: "date",
        validation: Yup.date().required("Due Date is required"),
      },
      {
        name: "status",
        title: "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "In Progress", value: "inProgress", color: "#007ACC" },
          { label: "Completed", value: "completed", color: "#008000" },

        ],
        validation: Yup.string().required("Status is required"),
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
        validation: Yup.string().required("Priority is required"),
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
        validation: Yup.string().required("Description is required"),
      },
    ],
    layout: {
      rows: 3,
      columns: 4,
      fields: {
        taskName: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 4 },
        status: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 2 },
      },

    },
    renderMode: "kanban",
  },
  {
    name: "material_inquiries",
    path: "my-material_inquiries",
    icon: "pi pi-box",
    label: translationKeys.MaterialInquiries || "My Material Inquiries",

    renderMode: "crud",
    schema: [
      {
        name: "materialName",
        title: translationKeys.MaterialName || "Material Name",
        type: "text",
        validation: Yup.string().required("Material name is required"),
      },
      {
        name: "quantity",
        title: translationKeys.Quantity || "Quantity",
        type: "number",
        validation: Yup.number()
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),
      },
      {
        name: "inquiryDate",
        title: translationKeys.InquiryDate || "Inquiry Date",
        type: "date",
        validation: Yup.date().required("Inquiry date is required"),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "Approved", value: "approved", color: "#007ACC" },
          { label: "Declined", value: "declined", color: "#008000" },
        ],
        validation: Yup.string().required("Status is required"),
      },
    ],
    layout: {
      rows: 3,
      columns: 3,
      fields: {
        materialName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
        supplier: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
        quantity: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
        status: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 3 },
      },
      actions: [
        {
          name: "user_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 3,
          colSpan: 1,
          alignment: "top-right",
          actions: [
           
               { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
            { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
          ],
          orientation: "icons",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },

  {
    name: "injuries",
    path: "injuries",
    icon: "pi pi-exclamation-triangle",
    label: translationKeys.Injuries || "Injuries",

    renderMode: "crud",
    schema: [
      {
        name: "incidentType",
        title: translationKeys.IncidentType || "Incident Type",
        type: "select",
        options: [
          { label: "Slip and Fall", value: "slip_fall" },
          { label: "Equipment Malfunction", value: "equipment_malfunction" },
          { label: "Fire Hazard", value: "fire_hazard" },
          { label: "Chemical Exposure", value: "chemical_exposure" },
          { label: "Electrical Shock", value: "electrical_shock" },
          { label: "Cuts and Lacerations", value: "cuts_lacerations" },
        ],
        validation: Yup.string().required("Incident type is required"),
      },
      {
        name: "location",
        title: translationKeys.Location || "Location",
        type: "text",
        validation: Yup.string().required("Location is required"),
      },
      {
        name:"project",
        type: "ref",
        title: translationKeys.Project || "Project",
        resource: "projects",
        field: "projectName",
      },
      {
        name: "severity",
        title: translationKeys.Severity || "Severity",
        type: "status",
        options: [
          { label: "low", value: "low", color: "#FFD700" },
          { label: "medium", value: "medium", color: "#007ACC" },
          { label: "high", value: "high", color: "#008000" },
          { label: "critical", value: "critical", color: "#FF6347" },
        ],
        validation: Yup.string().required("Severity is required"),
      },
      {
        name: "date",
        title: translationKeys.Date || "Date",
        type: "date",
        validation: Yup.date().required("Date is required"),
      },
    ],
    layout: {
      rows: 2,
      columns: 5,
      fields: {
        location: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
        severity: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 2},
        date: { rowStart: 1, colStart: 4, rowSpan: 1, colSpan: 1 },
      },
      actions: [
        {
          name: "user_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 5,
          colSpan: 1,
          alignment: "top-right",
          actions: [
           
               { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
            { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
          ],
          orientation: "icons",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },

  {
    name: "material_inquiries",
    path: "material_inquiries",
    icon: "pi pi-box",
    label: translationKeys.MaterialInquiries || "Material Inquiries",

    renderMode: "kanban",
    schema: [
      {
        name: "materialName",
        title: translationKeys.MaterialName || "Material Name",
        type: "text",
        validation: Yup.string().required("Material name is required"),
      },
      {
        name: "quantity",
        title: translationKeys.Quantity || "Quantity",
        type: "number",
        validation: Yup.number()
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),
      },
      {
        name: "inquiryDate",
        title: translationKeys.InquiryDate || "Inquiry Date",
        type: "date",
        validation: Yup.date().required("Inquiry date is required"),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "status",
        options: [
          { label: "Pending", value: "pending", color: "#FFD700" },
          { label: "Approved", value: "approved", color: "#007ACC" },
          { label: "Declined", value: "declined", color: "#008000" },
        ],
        validation: Yup.string().required("Status is required"),
      },
    ],
    layout: {
      rows: 3,
      columns: 3,
      fields: {
        materialName: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 2 },
        supplier: { rowStart: 1, colStart: 3, rowSpan: 1, colSpan: 1 },
        quantity: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 1 },
        status: { rowStart: 3, colStart: 1, rowSpan: 1, colSpan: 3 },
      },
      actions: [
        {
          name: "user_actions",
          rowStart: 1,
          rowSpan: 1,
          colStart: 3,
          colSpan: 1,
          alignment: "top-right",
          actions: [
           
               { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
            { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
          ],
          orientation: "icons",
          style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
        },
      ],
    },
  },


    {
      name: "reports",
      path: "reports",
      icon: "pi pi-file",
      label: "Daily Reports",
  
      schema: [

        {
          name: "project",
          title: "Project",
          type: "ref",
          resource: "projects",
          field: "projectName",
          validation: Yup.string().required("Project is required"),
        },
        {
          name: "weather",
          title: "Weather Conditions",
          type: "object",
          schema: [
            {
              name: "temperature",
              title: "Temperature",
              type: "number",
            },
            {
              name: "conditions",
              title: "Conditions",
              type: "select",
              options: [
                { label: "Sunny", value: "sunny" },
                { label: "Cloudy", value: "cloudy" },
                { label: "Rainy", value: "rainy" },
                { label: "Windy", value: "windy" },
              ],
            },
          ],
        },
        {
          name: "workHours",
          title: "Work Hours",
          type: "object",
          schema: [
            {
              name: "startTime",
              title: "Start Time",
              type: "time",
            },
            {
              name: "endTime",
              title: "End Time",
              type: "time",
            },
          ],
        },
        {
          name: "workforce",
          title: "Workforce on Site",
          type: "object array",
          schema: [
            {
              name: "type",
              title: "Worker Type",
              type: "text",
            },
            {
              name: "count",
              title: "Number of Workers",
              type: "number",
            },
          ],
        },
        {
          name: "equipmentUsed",
          title: "Equipment Used",
          type: "object array",
          schema: [
            {
              name: "equipmentName",
              title: "Equipment",
              type: "text",
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
            },
            {
              name: "hours",
              title: "Hours Used",
              type: "number",
            },
          ],
        },
        {
          name: "completedWork",
          title: "Work Completed",
          type: "object array",
          schema: [
            {
              name: "task",
              title: "Task",
              type: "ref",
              resource: "tasks",
              field: "taskName",
            },
            {
              name: "progress",
              title: "Progress",
              type: "number",
            },
            {
              name: "notes",
              title: "Notes",
              type: "text",
            },
          ],
        },
        {
          name: "materialsDelivered",
          title: "Materials Delivered",
          type: "object array",
          schema: [
            {
              name: "material",
              title: "Material",
              type: "text",
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
            },
            {
              name: "unit",
              title: "Unit",
              type: "text",
            },
          ],
        },
        {
          name: "delays",
          title: "Delays/Issues",
          type: "object array",
          schema: [
            {
              name: "issue",
              title: "Issue Description",
              type: "text",
            },
            {
              name: "duration",
              title: "Duration (minutes)",
              type: "number",
            },
            {
              name: "impact",
              title: "Impact",
              type: "select",
              options: [
                { label: "Minor", value: "minor" },
                { label: "Moderate", value: "moderate" },
                { label: "Major", value: "major" },
              ],
            },
          ],
        },
        {
          name: "safetyObservations",
          title: "Safety Observations",
          type: "object array",
          schema: [
            {
              name: "observation",
              title: "Observation",
              type: "text",
            },
            {
              name: "type",
              title: "Type",
              type: "select",
              options: [
                { label: "Hazard", value: "hazard" },
                { label: "Compliance", value: "compliance" },
                { label: "Improvement", value: "improvement" },
              ],
            },
            {
              name: "action",
              title: "Action Taken",
              type: "text",
            },
          ],
        },
        {
          name: "nextDayPlanning",
          title: "Next Day Planning",
          type: "object array",
          schema: [
            {
              name: "plannedTask",
              title: "Planned Task",
              type: "text",
            },
            {
              name: "requiredResources",
              title: "Required Resources",
              type: "text",
            },
          ],
        },
        {
          name: "photos",
          title: "Site Photos",
          type: "object array",
          schema: [
            {
              name: "photo",
              title: "Photo",
              type: "image",
            },
            {
              name: "description",
              title: "Description",
              type: "text",
            },
          ],
        },
        {
          name: "submittedBy",
          title: "Submitted By",
          type: "ref",
          resource: "users",
          field: "fullname",
          validation: Yup.string().required("Submitter is required"),
        },
      ],
      layout: {
        rows: 4,
        columns: 3,
        fields: {
          reportDate: { rowStart: 1, colStart: 1, rowSpan: 1, colSpan: 1 },
          project: { rowStart: 1, colStart: 2, rowSpan: 1, colSpan: 2 },
          
        },
        actions: [
          {
            name: "user_actions",
            rowStart: 1,
            rowSpan: 1,
            colStart: 3,
            colSpan: 1,
            alignment: "top-right",
            actions: [
              { name: "goToView", icon: "pi pi-eye", label: "View" },
              { name: "goToEdit", icon: "pi pi-pencil", label: "Edit" },
              { name: "deleteResource", icon: "pi pi-trash", label: "Delete" },
              { name: "exportPDF", icon: "pi pi-file-pdf", label: "Export PDF" },
            ],
            orientation: "icons",
            style: "position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;",
          },
        ],
      },
      renderMode: "crud",
    }
  

];
