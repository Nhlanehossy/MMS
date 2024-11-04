


exports.report_management_system = [
    {
      name: "reports",
      path: "reports",
      icon: "pi pi-file",
      schema: [

        {
          name: "faults",
          type: "tags",
          tagInputType: "refs",
          resource: "faults",
          field: "faultName",
        },
        {
          name: "reportDate",
          type: "date",
        },
        {
          name: "description",
          type: "richtext",
        },
        {
          name:"email",
          type: "email",
        },
        {
          name: "location",
          type: "ref",
          resource: "locations",
          field: "locationName",
        },
        {
          name: "priority",
          type: "select",
          options: [
            { label: "Low", value: "low", color: "#FFD700" },
            { label: "Medium", value: "medium", color: "#007ACC" },
            { label: "High", value: "high", color: "#008000" },
          ],
        },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Open", value: "open", color: "#FFD700" },
            { label: "Closed", value: "closed", color: "#007ACC" },
            { label: "Resolved", value: "resolved", color: "#008000" },
            { label: "Cancelled", value: "cancelled", color: "#FF6347" },
          ],
        }
      ],
      renderMode: "kanban",
      crudType: "grid"
    },
    
    {
      name: "faults",
      path: "faults",
      icon: "pi pi-exclamation-triangle",
      schema: [
        {
            name:"faultName",
            type: "text",
        },
        {
          name: "faultType",
          type: "select",
          options:[
            {label:"Electrical", value:"electrical"},
            {label:"Mechanical", value:"mechanical"},   
            {label:"Plumbing", value:"plumbing"},
            {label:"Other", value:"other"},
          ],
        },
        {
          name: "description",
          type: "richtext",
        }
      ],
      renderMode: "crud",
      crudType: "table"
    },


  {
    name: "locations",
    path: "locations",
    icon: "pi pi-map-marker",
    schema: [
      {
        name: "locationName",
        type: "text",
      },
      {
        name: "description",
        type: "richtext",
      },
    ],
    renderMode: "crud",
  },


    {
      name: "feedbacks",
      path: "feedbacks",
      icon: "pi pi-comments",
      menuGroupIcon: "pi pi-folder",
      schema: [
        {
          name: "report",
          type: "ref",
          resource: "reports",
          field: "email",
        },
        {
          name: "feedbackDate",
          type: "date",
        },
        {
          name: "comment",
          type: "richtext",
        },
      ],
      renderMode: "crud",
      crudType: "list"
    },
  
    {
      name: "allocations",
      path: "allocations",
      icon: "pi pi-calendar",
      menuGroupIcon: "pi pi-folder",
      schema: [
        {
          name: "report",
          type: "ref",
          resource: "reports",
          field: "reportTitle",
        },
        
        {
            name:"assignedTo",
            type: "ref",
            resource: "users",
            field: "fullname",
        },

        {
          name: "materials",
          type: "object array",
          schema: [
            {
              name: "material",
              type: "text",
            },
            {
              name: "quantity",
              type: "number",
            },
          ],

        },

        {
          name: "status",
          type: "select",
          options: [
            { label: "Open", value: "open", color: "#FFD700" },
            { label: "Closed", value: "closed", color: "#007ACC" },
            { label: "Pending", value: "pending", color: "#008000" },
            { label: "Cancelled", value: "cancelled", color: "#FF6347" },
            { label: "Completed", value: "completed", color: "#008080" },   
          ],
        }
      ],
      renderMode: "crud",
      crudType: "table"
    },
  

    {
      name: "caretakers",
      path: "caretakers",
      icon: "pi pi-user",
      schema: [
        {
          name: "fullName",
          type: "text",
        },
        {
          name: "email",
          type: "email",
        },
        {
          name: "phone",
          type: "text",
        },
        {
          name: "specialization",
          type: "select",
          options: [
            { label: "Electrical", value: "electrical" },
            { label: "Mechanical", value: "mechanical" },
            { label: "Plumbing", value: "plumbing" },
            { label: "General Maintenance", value: "general" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "assignedLocations",
          type: "tags",
          tagInputType: "refs",
          resource: "locations",
          field: "locationName",
        },
        {
          name: "status",
          type: "select",
          options: [
            { label: "Active", value: "active", color: "#008000" },
            { label: "On Leave", value: "onLeave", color: "#FFD700" },
            { label: "Inactive", value: "inactive", color: "#FF6347" },
          ],
        },
        {
          name: "notes",
          type: "richtext",
        },
      ],
      renderMode: "crud",
      crudType: "table"
    },
  
  ];