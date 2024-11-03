exports.system_settings = [
  {
    name: "system-logs",
    path: "system-logs",
    icon: "pi pi-file",
    menuGroupIcon: "pi pi-shield",
    renderMode: "crud",
    schema: [

      {
        name: "action",

        type: "text",
      },
      {
        name: "user",

        type: "text",
      },
      {
        name: "status",

        type: "status",
        options: [
          { label: "Success", value: "Success", color: "#28a745" },
          { label: "Failure", value: "Failure", color: "#dc3545" },
        ],
      },
    ],
  },
  {
    name: "company-config",
    icon: "fa fa-building",
    label: "Company Configuration",
    menuGroup: "Settings",
    menuGroupIcon: "fa fa-cog",
    schema: [
      {
        name: "logo",
        title: "Company Logo",
        type: "image",
      },
      {
        name: "companyName",
        title: "Company Name",
        type: "text",
      },
      {
        name: "companyGoogleMapLink",
        title: "Company Google Map Link",
        type: "text",
      },
      {
        name: "companyEmails",
        title: "Company Emails",
        type: "object array",
        schema: [
          {
            name: "name",
            title: "Name",
            type: "text",
          },
          {
            name: "email",
            title: "Email",
            type: "email",
          },
        ],
      },

      {
        name: "companyPhoneNumbers",
        title: "Company Phone Numbers",
        type: "object array",
        schema: [
          {
            name: "name",
            title: "Name",
            type: "text",
          },
          {
            name: "phoneNumber",
            title: "Phone Number",
            type: "text",
          },
        ],
      },
      {
        name: "companySocialMediaLinks",
        title: "Company Social Media Links",
        type: "object array",
        schema: [
          {
            name: "icon",
            title: "Icon",
            type: "image",
          },
          {
            name: "name",
            title: "Name",
            type: "text",
          },
          {
            name: "link",
            title: "link",
            type: "text",
          },
        ],
      },
      {
        name: "companyAddress",
        title: "Company Address",
        type: "richtext",
      },
      {
        name: "companyLocation",
        title: "Location",
        type: "richtext",
      },
      {
        name: "companyMotto",
        title: "Motto",
        type: "richtext",
      },
    ],
    renderMode: "singleton",
  },
  {
    name: "system-config",
    icon: "fa fa-cog",
    label: "System Configuration",
    menuGroup: "Settings",
    menuGroupIcon: "fa fa-wrench",
    schema: [
      {
        name: "logo",
        title: "System Logo",
        type: "image",
      },
      {
        name: "appName",
        title: "Application Name",
        type: "text",
      },
      {
        name: "appVersion",
        title: "Application Version",
        type: "text",
      },
      {
        name: "appLanguage",
        title: "Language",
        type: "select",
        options: [
          {
            label: "English",
            value: "en",
          },
          {
            label: "French",
            value: "fr",
          },
          {
            label: "Spanish",
            value: "es",
          },
          {
            label: "Portuguese",
            value: "pt",
          },
        ],
      },
      {
        name: "googleConfig",
        title: "Google Configuration",
        type: "object",
        schema: [
          {
            name: "clientId",
            title: "Client ID",
            type: "text",
          },
          {
            name: "clientSecret",
            title: "Client Secret",
            type: "text",
          },
          {
            name: "userEmail",
            title: "User Email",
            type: "text",
          },
          {
            name: "userPassword",
            title: "User Password",
            type: "text",
          },
          {
            name: "accessToken",
            title: "Access Token",
            type: "text",
          },
          {
            name: "refreshToken",
            title: "Refresh Token",
            type: "text",
          },
        ],
      },
      {
        name: "StripeConfig",
        title: "Stripe Configuration",
        type: "object",
        schema: [
          {
            name: "publishableKey",
            title: "Publishable Key",
            type: "text",
          },
          {
            name: "secretKey",
            title: "Secret Key",
            type: "text",
          },
        ],
      },
      {
        name: "PaypalConfig",
        title: "Paypal Configuration",
        type: "object",
        schema: [
          {
            name: "clientId",
            title: "Client ID",
            type: "text",
          },
          {
            name: "clientSecret",
            title: "Client Secret",
            type: "text",
          },
        ],
      },
      {
        name: "JwtConfig",
        title: "JWT Configuration",
        type: "object",
        schema: [
          {
            name: "secretKey",
            title: "Secret Key",
            type: "text",
          },
        ],
      },
      {
        name: "databaseConfig",
        title: "Database Configuration",
        type: "object",
        schema: [
          {
            name: "databaseURL",
            title: "Database URL",
            type: "text",
          },
        ],
      },
      {
        name: "FirebaseConfig",
        title: "Firebase Configuration",
        type: "object",
        schema: [
          {
            name: "apiKey",
            title: "API Key",
            type: "text",
          },
          {
            name: "authDomain",
            title: "Auth Domain",
            type: "text",
          },
          {
            name: "projectId",
            title: "Project ID",
            type: "text",
          },
          {
            name: "storageBucket",
            title: "Storage Bucket",
            type: "text",
          },
          {
            name: "messagingSenderId",
            title: "Messaging Sender ID",
            type: "text",
          },
          {
            name: "appId",
            title: "App ID",
            type: "text",
          },
        ],
      },
      {
        name: "TwilioConfig",
        title: "Twilio Configuration",
        type: "object",
        schema: [
          {
            name: "accountSid",
            title: "Account SID",
            type: "text",
          },
          {
            name: "authToken",
            title: "Auth Token",
            type: "text",
          },
          {
            name: "twilioNumber",
            title: "Twilio Number",
            type: "text",
          },
        ],
      },
      {
        name: "s3Config",
        title: "Amazon S3 Configuration",
        type: "object",
        schema: [
          { name: "accessKeyId", title: "Access Key ID", type: "text" },
          { name: "secretAccessKey", title: "Secret Access Key", type: "text" },
          { name: "bucketName", title: "Bucket Name", type: "text" },
        ],
      },
      {
        name: "openAIConfig",
        title: "OpenAI Configuration",
        type: "object",
        schema: [{ name: "apiKey", title: "API Key", type: "text" }],
      },
      {
        name: "loginPageLayout",
        title: "Login Page Layout",
        type: "select",
        options: [
          {
            label: "Default Layout",
            value: "DefaultLayout",
          },
          {
            label: "Split Layout",
            value: "SplitLayout",
          },
        ],
      },
      {
        name: "appDescription",
        title: "Application Description",
        type: "richtext",
      },
      {
        name: "maintenanceMessage",
        title: "Maintenance Message",
        type: "richtext",
      },
      {
        name: "maintenanceMode",
        title: "Maintenance Mode",
        type: "check",
      },
    ],

    renderMode: "singleton",
  },
];
