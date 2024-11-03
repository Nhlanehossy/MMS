const Yup = require("yup");

exports.insurance_claims_management_system = [
  {
    name: "policies",
    path: "policies",
    menuGroupIcon: "fa fa-shield-alt",
    schema: [
      {
        name: "policyNumber",
        type: "text",
        validation: Yup.string().required("Policy Number is required."),
      },
      {
        name: "policyName",
        type: "text",
        validation: Yup.string().required("Policy Name is required."),
      },

      {
        name: "premium",
        type: "number",
        defaultValue: 0, // Default to 0
        validation: Yup.number().required("Premium is required.").positive("Premium must be positive."),
      },
      {
        name: "status",
        type: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Expired", value: "expired" },
        ],
        defaultValue: "active", // Default to "active"
        validation: Yup.string().required("Status is required."),
      },
    ],
    renderMode: "crud",
    actions: [{ view: "goToView" }, { edit: "goToEdit" }, { delete: "deleteResource" }],
  },

  {
    name: "claims",
    path: "claims",
    icon: "fa fa-file-alt",
    menuGroupIcon: "fa fa-tasks",
    schema: [
      {
        name: "claimNumber",
        type: "text",
        validation: Yup.string().required("Claim Number is required."),
      },
      {
        name: "policy",
        type: "ref",
        resource: "policies",
        field: "policyName",
        validation: Yup.string().required("Policy is required."),
      },
      {
        name: "claimant",
        type: "ref",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("Claimant is required."),
      },
      {
        name: "incidentDate",
        type: "date",        
        validation: Yup.date().required("Incident Date is required.").nullable(),
      },
      {
        name: "filingDate",
        type: "date",
        validation: Yup.date().required("Filing Date is required.").nullable(),
      },

      {
        name: "description",
        type: "richtext",
        defaultValue: "", 
        validation: Yup.string().required("Description is required."),
      },
      {
        name: "claimedAmount",
        type: "number",
        defaultValue: 0, 
        validation: Yup.number().required("Claimed Amount is required.").positive("Claimed Amount must be positive."),
      },
      {
        name: "status",
        type: "select",
        options: [
          { label: "Submitted", value: "submitted" },
          { label: "Under Review", value: "under_review" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
          { label: "Paid", value: "paid" },
          { label: "Closed", value: "closed" },
        ],
        defaultValue: "submitted", 
        validation: Yup.string().required("Status is required."),
      },
      {
        name: "images",
        type: "image array",
        defaultValue: [], 
        validation: Yup.array().of(Yup.string().required("Each image must be provided.")),
      },
    ],
    renderMode: "crud",
    actions: [{ view: "goToView" }, { edit: "goToEdit" }, { delete: "deleteResource" }],
  },
];
