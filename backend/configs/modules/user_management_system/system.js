exports.user_management_system = [
  {
    name: "users",
    icon: "fa fa-user",
    label: "Users",
    isUser: true,
    menuGroup: "Users",
    menuGroupIcon: "fa fa-user-cog",
    schema: [
      {
        name: "undefined",
        title: "Profile Picture",
        type: "image",
      },
      {
        name: "fullname",
        title: "Full Name",
        type: "text",
      },
      {
        name: "email",
        title: "Email",
        type: "email",
      },
      {
        name: "password",
        title: "Password",
        type: "password",
      },
      {
        name: "phoneNumber",
        title: "Phone Number",
        type: "phone",
      },

      {
        name: "dateOfBirth",
        title: "Date Of Birth",
        type: "date",
      },
      {
        name: "recruitmentDate",
        title: "Recruitment Date",
        type: "date",
      },
      {
        name: "role",
        title: "User Role",
        type: "ref",
        resource: "roles",
        field: "roleName",
      },
      {
        name: "status",
        title: "Status",
        type: "ref",
        resource: "staff-statuses",
        isStatus: true,
        field: "status",
      },
      {
        name: "gender",
        title: "Gender",
        type: "ref",
        resource: "genders",
        field: "gender",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
      },
      {
        name: "isAccountActive",
        title: "Is Account Active",
        type: "check",
      },
      {
        name: "fcmTokens",
        title: "FCM Tokens",
        type: "tags",
      },
    ],

    renderMode: "object",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },
  {
    name: "staff-statuses",
    icon: "fa fa-check",
    label: "Staff Statuses",
    menuGroup: "Users",
    menuGroupIcon: "fa fa-user-cog",
    schema: [
      {
        name: "status",
        title: "Status",
        type: "text",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
      },
    ],

    renderMode: "singleton",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },
  {
    name: "genders",
    icon: "fa fa-venus-mars",
    label: "Genders",
    menuGroup: "Users",
    menuGroupIcon: "fa fa-user-cog",
    schema: [
      {
        name: "gender",
        title: "Gender",
        type: "text",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
      },
      {
        name: "icon",
        title: "Icon",
        type: "image",
      },
    ],

    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },
  {
    name: "roles",
    icon: "fa fa-bookmark",
    label: "Roles",
    menuGroup: "Access Control",
    menuGroupIcon: "fa fa-user-shield",
    schema: [
      {
        name: "roleName",
        title: "Role Name",
        type: "text",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
      },
    ],
    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },
  {
    name: "modules",
    icon: "fa fa-cubes",
    label: "Modules",
    menuGroup: "Access Control",
    menuGroupIcon: "fa fa-user-shield",
    schema: [
      {
        name: "moduleName",
        title: "Module Name",
        type: "text",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
      },
    ],

    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },

  {
    name: "extra-actions",

    schema: [
      {
        name: "icon",
        type: "icon",

      },
      {
        name: "label",
        type: "text",
     
      },
      {
        name: "name",
        type: "text",

      },
      {
        name: "description",
        type: "richtext",
      } ,
    ],

    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },
  {
    name: "permissions",
    icon: "fa fa-user-shield",
    label: "Permissions",
    menuGroup: "Access Control",
    menuGroupIcon: "fa fa-user-shield",
    schema: [
      {
        name: "role",
        title: "Role",
        type: "ref",
        resource: "roles",
        field: "roleName",
      },
      {
        name: "module",
        title: "Module",
        type: "ref",
        resource: "modules",
        field: "moduleName",
      },
      {
        name: "create",
        title: "Create",
        type: "check",
      },
      {
        name: "read",
        title: "Read",
        type: "check",
      },
      {
        name: "update",
        title: "Update",
        type: "check",
      },
      {
        name: "delete",
        title: "Delete",
        type: "check",
      },
      {
        name: "extraActions",
        title: "Extra Actions",
        type: "tags",
        tagInputType: "refs",
        resource: "extra-actions",
        field: "name"
      }
    ],
    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" },
      { delete: "deleteResource" },
    ],
  },
  {
    name: "activity-log",
    icon: "fa fa-history",
    label: "Log",
    menuGroup: "System",
    menuGroupIcon: "fa fa-user-shield",
    schema: [
      {
        name: "action",
        title: "Action",
        type: "text",
      },
      {
        name: "description",
        title: "Description",
        type: "richtext",
      },
    ],
    renderMode: "crud",
    actions: [
      { view: "goToView" },
      { edit: "goToEdit" }, 
    ],
  },
  {
    name:"notifications",
    icon: "fa fa-bell",
    label: "Notifications",
    menuGroup: "System",
    menuGroupIcon: "fa fa-user-shield",
    schema: [
      {
        name: "title",
        title: "Title",
        type: "text",
      },
      {
        name: "body",
        title: "Body",
        type: "text",
      },
      {
        name: "icon",
        title: "Icon",
        type: "image",
      },
      {
        name: "read",
        title: "Read",
        type: "check",
      },
      {
        name: "recipient",
        title: "Recipient",
        type:'ref',
        resource: "users",
        field: "fullName"
      }
    ]
  }

];
