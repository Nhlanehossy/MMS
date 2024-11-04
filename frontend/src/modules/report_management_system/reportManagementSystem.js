import * as Yup from "yup";
import { translationKeys } from "@/executables/translation";

export const report_management_system = [
  {
    name: "reports",
    path: "reports",
    icon: "pi pi-file",
    label: translationKeys.Reports || "Reports",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup:
      translationKeys.ReportManagementSystem || "Report Management",
    schema: [

      {
        name: "faults",
        title: translationKeys.Faults || "Faults",
        type: "tags",
        tagInputType: "refs",
        resource: "faults",
        field: "faultName",
        validation: Yup.string().required("At least one Fault is required."),
      },
      {
        name: "reportDate",
        title: "Report Date",
        type: "date",
        validation: Yup.date().required("Report Date is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
      {
        name: "location",
        title: translationKeys.Location,
        type: "ref",
        resource: "locations",
        field: "locationName",
        validation: Yup.string().required("Location is required."),
      },
      {
        name: "priority",
        title: translationKeys.Priority,
        type: "select",
        options: [
          { label: "Low", value: "low", color: "#FFD700" },
          { label: "Medium", value: "medium", color: "#007ACC" },
          { label: "High", value: "high", color: "#008000" },
        ],
        validation: Yup.string().required("Priority is required."),
      },
      {
        name: "status",
        title: translationKeys.Status,
        type: "status",
        options: [
          { label: "Open", value: "open", color: "#FFD700" },
          { label: "In Progress", value: "inProgress", color: "#007ACC" },
          { label: "Resolved", value: "resolved", color: "#008000" },
          { label: "Cancelled", value: "cancelled", color: "#FF6347" },
        ],
        validation: Yup.string().required("Status is required."),
      },
      
    ],
    layout:{
      rows:4,
      columns:4,
      fields: {
        faults: { rowStart: 2, colStart: 1, rowSpan: 1, colSpan: 4 },
  
        location: { rowStart: 4, colStart: 1, rowSpan: 1, colSpan: 2 },
      },
    },
    renderMode: "kanban",
    crudType: "grid",
  },
  {
    name: "reports",
    path: "my-reports",
    icon: "pi pi-file",
    label: "My Reports",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup:
      translationKeys.ReportManagementSystem || "Report Management",
    schema: [

      {
        name: "faults",
        title: translationKeys.Faults || "Faults",
        type: "tags",
        tagInputType: "refs",
        resource: "faults",
        field: "faultName"
      },
      {
        name: "reportDate",
        title: translationKeys.ReportDate,
        type: "date",
        validation: Yup.date().required("Report Date is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
      {
        name: "location",
        title: translationKeys.Location,
        type: "ref",
        resource: "locations",
        field: "locationName",
        validation: Yup.string().required("Location is required."),
      },
      {
        name: "email",
        title: "Your Email",
        type: "email",
        validation: Yup.string()
          .email("Invalid email format.")
          .required("Email is required."),
      },
      {
        name: "status",
        title: translationKeys.Status,
        type: "status",
        options: [
          { label: "Open", value: "open", color: "#FFD700" },
          { label: "In Progress", value: "inProgress", color: "#007ACC" },
          { label: "Resolved", value: "resolved", color: "#008000" },
          { label: "Cancelled", value: "cancelled", color: "#FF6347" },
        ],
        validation: Yup.string().required("Status is required."),
      },
    ],
    renderMode: "crud",
    crudType: "table",
  },
  {
    name: "allocations",
    path: "allocations",
    icon: "pi pi-calendar",
    label: translationKeys.Allocations || "Allocations",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup:
      translationKeys.ReportManagementSystem || "Report Management",
    schema: [
      {
        name: "report",
        title: translationKeys.Report,
        type: "ref",
        resource: "reports",
        field: "faults",
        validation: Yup.string().required("Report is required."),
      },
      {
        name: "location",
        title: translationKeys.Location,
        type: "ref",
        resource: "locations",
        field: "locationName",
        validation: Yup.string().required("Location is required."),
      },

      {
        name: "assignedTo",
        title: translationKeys.AssignedTo || "Assigned To",
        type: "ref",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("Assignee is required."),
      },

      {
        name: "materials",
        title: translationKeys.Materials || "Materials",
        type: "object array",
        schema: [
          {
            name: "material",
            type: "text",
            validation: Yup.string().required("Material is required."),
          },
          {
            name: "quantity",
            type: "number",
            validation: Yup.number().min(0).required("Quantity is required."),
          },
        ],
        validation: Yup.array().required("Materials is required."),
      },

      {
        name: "status",
        title: translationKeys.Status,
        type: "select",
        options: [
          { label: "Open", value: "open", color: "#FFD700" },
          { label: "Closed", value: "closed", color: "#007ACC" },
          { label: "Pending", value: "pending", color: "#008000" },
          { label: "Cancelled", value: "cancelled", color: "#FF6347" },
          { label: "Completed", value: "completed", color: "#008080" },
        ],
        validation: Yup.string().required("Status is required."),
      },
    ],
    renderMode: "crud",
    crudType: "table",
  },

  {
    name: "faults",
    path: "faults",
    icon: "pi pi-exclamation-triangle",
    label: translationKeys.Faults || "Faults",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup:
      translationKeys.ReportManagementSystem || "Report Management",
    schema: [
      {
        name: "faultName",
        title: "fault name",
        type: "text",
        validation: Yup.string().required("Fault Name is required."),
      },
      {
        name: "faultType",
        title: "Type",
        type: "select",
        options: [
          { label: "Electrical", value: "electrical" },
          { label: "Mechanical", value: "mechanical" },
          { label: "Plumbing", value: "plumbing" },
          { label: "Other", value: "other" },
        ],
        validation: Yup.string().required("Fault Type is required."),
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
  },

  {
    name: "locations",
    path: "locations",
    icon: "pi pi-map-marker",
    label: translationKeys.Locations || "Locations",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup:
      translationKeys.ReportManagementSystem || "Report Management",
    schema: [
      {
        name: "locationName",
        title: translationKeys.LocationName,
        type: "text",
        validation: Yup.string().required("Location Name is required."),
      },
      {
        name: "description",
        title: translationKeys.Description,
        type: "richtext",
        validation: Yup.string().required("Description is required."),
      },
    ],
    renderMode: "crud",
  },

  {
    name: "feedbacks",
    path: "feedbacks",
    icon: "pi pi-comments",
    label: translationKeys.Feedbacks || "Feedbacks",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup:
      translationKeys.ReportManagementSystem || "Report Management",
    schema: [
      {
        name: "report",
        title: translationKeys.Report,
        type: "ref",
        resource: "reports",
        field: "email",
        validation: Yup.string().required("Report is required."),
      },
      {
        name: "feedbackDate",
        title: translationKeys.FeedbackDate,
        type: "date",
        validation: Yup.date().required("Feedback Date is required."),
      },
      {
        name: "comment",
        title: translationKeys.Comment,
        type: "richtext",
        validation: Yup.string().required("Comment is required."),
      },
    ],
    renderMode: "crud",
    crudType: "list",
  },

  {
    name: "caretakers",
    path: "caretakers",
    icon: "pi pi-user",
    label: translationKeys.Caretakers || "Caretakers",
    menuGroup: translationKeys.ReportManagement,
    menuGroupIcon: "pi pi-folder",
    resourceGroup: translationKeys.ReportManagementSystem || "Report Management",
    schema: [
      {
        name: "fullName",
        title: translationKeys.FullName || "Full Name",
        type: "text",
        validation: Yup.string().required("Full Name is required."),
      },
      {
        name: "email",
        title: translationKeys.Email || "Email",
        type: "email",
        validation: Yup.string()
          .email("Invalid email format")
          .required("Email is required."),
      },
      {
        name: "phone",
        title: translationKeys.Phone || "Phone",
        type: "text",
        validation: Yup.string().required("Phone number is required."),
      },
      {
        name: "specialization",
        title: translationKeys.Specialization || "Specialization",
        type: "select",
        options: [
          { label: "Electrical", value: "electrical" },
          { label: "Mechanical", value: "mechanical" },
          { label: "Plumbing", value: "plumbing" },
          { label: "General Maintenance", value: "general" },
          { label: "Other", value: "other" },
        ],
        validation: Yup.string().required("Specialization is required."),
      },
      {
        name: "assignedLocations",
        title: translationKeys.AssignedLocations || "Assigned Locations",
        type: "tags",
        tagInputType: "refs",
        resource: "locations",
        field: "locationName",
        validation: Yup.array().min(1, "At least one location must be assigned."),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "select",
        options: [
          { label: "Active", value: "active", color: "#008000" },
          { label: "On Leave", value: "onLeave", color: "#FFD700" },
          { label: "Inactive", value: "inactive", color: "#FF6347" },
        ],
        validation: Yup.string().required("Status is required."),
      },
      {
        name: "notes",
        title: translationKeys.Notes || "Notes",
        type: "richtext",
      },
    ],
    renderMode: "crud",
    crudType: "table",
  },

];
 // ... previous resources remain the sam
  

