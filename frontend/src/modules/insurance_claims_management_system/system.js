import { v4 as uuidv4 } from "uuid";  
import { translationKeys } from '@/executables/translation';
import * as Yup from "yup";

export const insurance_claims_management_system = [


  {
    name: "claims",
    path: "claims",
    icon: "fa fa-file-alt",
    label: translationKeys.Claims || "Claims",
    resourceGroup: translationKeys.InsuranceClaimsManagementSystem || "insurance",
    schema: [
      {
        name: "claimNumber",
        title: translationKeys.ClaimNumber || "Claim Number",
        type: "text",
        defaultValue: () => `CLM-${uuidv4().split('-')[0]}`, // Generates a custom formatted UUID
        validation: Yup.string().required("Claim Number is required."),
      },
      {
        name: "policy",
        title: translationKeys.Policy || "Policy",
        type: "ref",
        resource: "policies",
        field: "policyName",
        validation: Yup.string().required("Policy is required."),
      },
      {
        name: "claimant",
        title: translationKeys.Claimant || "Claimant",
        type: "ref",
        resource: "users",
        field: "fullname",
        validation: Yup.string().required("Claimant is required."),
      },
      {
        name: "incidentDate",
        title: translationKeys.IncidentDate || "Incident Date",
        type: "date",
        defaultValue: null, // Default null for date fields
        validation: Yup.date().required("Incident Date is required.").nullable(),
      },
      {
        name: "filingDate",
        title: translationKeys.FilingDate || "Filing Date",
        type: "date",
        defaultValue: null, // Default null for date fields
        validation: Yup.date().required("Filing Date is required.").nullable(),
      },
      {
        name: "images",
        title: translationKeys.Documents || "Images",
        type: "image array",
        defaultValue: [], // Default empty array for image array
        validation: Yup.array().of(Yup.string().required("Each image must be provided.")),
      },
      {
        name: "description",
        title: translationKeys.Description || "Description",
        type: "richtext",
        defaultValue: "", // Default empty string for richtext
        validation: Yup.string().required("Description is required."),
      },
      {
        name: "claimedAmount",
        title: translationKeys.ClaimedAmount || "Claimed Amount",
        type: "number",
        defaultValue: 0, // Default 0 for numbers
        validation: Yup.number().required("Claimed Amount is required.").positive("Claimed Amount must be positive."),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "select",
        options: [
          { label: "Submitted", value: "submitted" },
          { label: "Under Review", value: "under_review" },
          { label: "Approved", value: "approved" },
          { label: "Rejected", value: "rejected" },
          { label: "Paid", value: "paid" },
          { label: "Closed", value: "closed" },
        ],
        defaultValue: "submitted", // Default to "submitted"
        validation: Yup.string().required("Status is required."),
      },
    ],
    renderMode: "crud",
    actions: [{ view: "goToView" }, { edit: "goToEdit" }, { delete: "deleteResource" }],
  },
  {
    name: "policies",
    path: "policies",
    icon: "fa fa-file-contract",
    label: translationKeys.Policies || "Policies",
    resourceGroup: translationKeys.InsuranceClaimsManagementSystem || "insurance",
    schema: [
      {
        name: "policyNumber",
        title: translationKeys.PolicyNumber || "Policy Number",
        type: "text",
        defaultValue: () => `POL-${uuidv4().split('-')[0]}`, // Generates a custom formatted UUID
        validation: Yup.string().required("Policy Number is required."),
      },
      {
        name: "policyName",
        title: translationKeys.PolicyName || "Policy Name",
        type: "text",
        validation: Yup.string().required("Policy Name is required."),
      },

      {
        name: "premium",
        title: translationKeys.Premium || "Premium",
        type: "number",
        defaultValue: 0, // Default to 0
        validation: Yup.number().required("Premium is required.").positive("Premium must be positive."),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
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
    path: "my-claims",
    icon: "fa fa-file-alt",
    label: "My Claims",
    resourceGroup: translationKeys.InsuranceClaimsManagementSystem || "insurance",
    schema: [
      {
        name: "claimNumber",
        title: translationKeys.ClaimNumber || "Claim Number",
        type: "text",
        defaultValue: () => `CLM-${uuidv4().split('-')[0]}`, // Generates a custom formatted UUID
        validation: Yup.string().required("Claim Number is required."),
      },
      {
        name: "policy",
        title: translationKeys.Policy || "Policy",
        type: "ref",
        resource: "policies",
        field: "policyName",
        validation: Yup.string().required("Policy is required."),
      },

      {
        name: "incidentDate",
        title: translationKeys.IncidentDate || "Incident Date",
        type: "date",
        validation: Yup.date().required("Incident Date is required.").nullable(),
      },
      {
        name: "filingDate",
        title: translationKeys.FilingDate || "Filing Date",
        type: "me",
        defaultValue: new Date().toISOString().split("T")[0], // Default empty string for text
      
      },
      {
        name: "images",
        title: translationKeys.Documents || "Images",
        type: "image array",
        defaultValue: [], // Default empty array for image array
        validation: Yup.array().of(Yup.string().required("Each image must be provided.")),
      },
      {
        name: "description",
        title: translationKeys.Description || "Description",
        type: "richtext",
        defaultValue: "", // Default empty string for richtext
        validation: Yup.string().required("Description is required."),
      },
      {
        name: "claimedAmount",
        title: translationKeys.ClaimedAmount || "Claimed Amount",
        type: "number",
        defaultValue: 0, // Default 0 for numbers
        validation: Yup.number().required("Claimed Amount is required.").positive("Claimed Amount must be positive."),
      },
      {
        name: "status",
        title: translationKeys.Status || "Status",
        type: "me",
        defaultValue: "submitted", // Default to "submitted"
      },
      {
        name: "claimant",
        title: translationKeys.Claimant || "Claimant",
        type: "me",
        defaultValue:'current_user_id',

      },
    ],
    pivot:{
      field:"claimant",
      value:'current_user_id'
    },
    renderMode: "crud",
    actions: [{ view: "goToView" }, { edit: "goToEdit" }, { delete: "deleteResource" }],
  },
  {
    name: "users",
    path: "policy-holders",
    icon: "fa fa-user",
    label: "Policy Holders",
    resourceGroup: translationKeys.InsuranceClaimsManagementSystem || "insurance",

    schema: [
      {
        name: "undefined",
        title: translationKeys.ProfilePicture,
        type: "image",
      },
      {
        name: "fullname",
        title: translationKeys.FullName,
        type: "text",
        validation: Yup.string().required("Full Name is required."),
      },
      {
        name: "email",
        title: translationKeys.Email,
        type: "email",
        validation: Yup.string().email("Invalid email format.").required("Email is required."),
      },

      {
        name: "phoneNumber",
        title: translationKeys.PhoneNumber,
        type: "phone",
        validation: Yup.string().required("Phone Number is required."),
      },
      

      {
        name: "gender",
        title: translationKeys.Gender,
        type: "ref",
        resource: "genders",
        field: "gender",
        validation: Yup.string().required("Gender is required."),
      },

    ],
    renderMode: "crud",
    pivot:{
      field:"role",
      value:'66de57b56c99dcbaeae904e2'
    },
  
    tabs: [
      {
        resource: "claims",
        pivot: "claimant",
      },
    ],
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },

];
