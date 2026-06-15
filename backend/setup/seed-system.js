require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Resources } = require("../configs/ResourceConfig");
const { generateMongooseSchemas } = require("../helpers/SchemaGenerator");

const generatedResources = generateMongooseSchemas(Resources);
const models = Object.fromEntries(
  generatedResources.map((resource) => [
    resource.endpoint,
    mongoose.models[resource.name] || mongoose.model(resource.name, resource.schema),
  ])
);

const roles = [
  ["Admin", "System administrator with full access"],
  ["Fault Manager", "Manages fault reports, statuses, feedback, and reporting workflows"],
  ["Maintenance Supervisor", "Reviews reported faults and assigns maintenance work"],
  ["Caretaker", "Handles assigned maintenance work for locations"],
  ["Reporter", "Submits and tracks fault reports"],
  ["Project Manager", "Manages projects, tasks, and site progress"],
  ["Finance Manager", "Manages budgets, expenses, invoices, and payments"],
  ["Site Worker", "Updates assigned site work and progress"],
  ["Clerk", "Handles operational records and routine updates"],
  ["Client", "Views project progress and related records"],
];

const sampleUsers = [
  ["Administrator", "admin@mms.local", "Admin"],
  ["Fault Manager", "fault.manager@mms.local", "Fault Manager"],
  ["Maintenance Supervisor", "maintenance.supervisor@mms.local", "Maintenance Supervisor"],
  ["Caretaker User", "caretaker@mms.local", "Caretaker"],
  ["Reporter User", "reporter@mms.local", "Reporter"],
  ["Project Manager", "project.manager@mms.local", "Project Manager"],
  ["Finance Manager", "finance.manager@mms.local", "Finance Manager"],
  ["Site Worker", "site.worker@mms.local", "Site Worker"],
  ["Clerk", "clerk@mms.local", "Clerk"],
  ["Client User", "client@mms.local", "Client"],
];

async function upsert(model, filter, update) {
  return model.findOneAndUpdate(filter, { $setOnInsert: update }, { upsert: true, new: true });
}

async function upsertAndSet(model, filter, update) {
  return model.findOneAndUpdate(filter, { $set: update }, { upsert: true, new: true });
}

async function seed() {
  const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/mms";
  await mongoose.connect(dbUrl);

  const Gender = models.genders;
  const Status = models["staff-statuses"];
  const Role = models.roles;
  const Module = models.modules;
  const ExtraAction = models["extra-actions"];
  const Permission = models.permissions;
  const ActivityLog = models["activity-log"];
  const Notification = models.notifications;
  const SystemLog = models["system-logs"];
  const User = models.users;
  const SystemConfig = models["system-config"];
  const CompanyConfig = models["company-config"];
  const Fault = models.faults;
  const Location = models.locations;
  const Report = models.reports;
  const Feedback = models.feedbacks;
  const Allocation = models.allocations;
  const Caretaker = models.caretakers;
  const Shop = models.shops;
  const Product = models.products;
  const Category = models.categories;
  const Review = models.reviews;
  const Material = models.materials;
  const Tag = models.tags;
  const Order = models.orders;
  const Payment = models.payments;
  const PaymentMethod = models.paymentMethods;
  const Policy = models.policies;
  const Claim = models.claims;
  const Project = models.projects;
  const Team = models.teams;
  const Budget = models.budget;
  const Task = models.tasks;
  const Injury = models.injuries;
  const MaterialInquiry = models.material_inquiries;
  const ConstructionReport = models["construction-reports"];
  const Chat = models.chat;
  const ChatConversation = models["chat-conversations"];
  const ChatMessage = models["chat-messages"];

  const male = await upsert(Gender, { gender: "Male" }, { gender: "Male", description: "Male gender" });
  await upsert(Gender, { gender: "Female" }, { gender: "Female", description: "Female gender" });
  const active = await upsert(Status, { status: "Active" }, { status: "Active", description: "Active status" });
  await upsert(Status, { status: "Inactive" }, { status: "Inactive", description: "Inactive status" });

  const moduleDocs = {};
  for (const resource of generatedResources) {
    moduleDocs[resource.endpoint] = await upsert(
      Module,
      { moduleName: resource.endpoint },
      { moduleName: resource.endpoint, description: `${resource.endpoint} management module` }
    );
  }

  const extraActionDocs = {};
  const extraActions = [
    ["assignFault", "Assign Fault", "fa fa-user-plus", "Move a fault report into the assigned/in-progress stage"],
    ["startWork", "Start Work", "fa fa-play", "Start work on an allocated fault"],
    ["resolveFault", "Resolve Fault", "fa fa-check", "Mark a fault report or allocation as resolved"],
    ["closeReport", "Close Report", "fa fa-lock", "Close a completed fault report"],
    ["processOrder", "Process Order", "fa fa-cogs", "Move an order into processing"],
    ["shipOrder", "Ship Order", "fa fa-truck", "Mark an order as shipped"],
    ["deliverOrder", "Deliver Order", "fa fa-box-open", "Mark an order as delivered"],
    ["completePayment", "Complete Payment", "fa fa-check-circle", "Mark a payment as completed"],
    ["refundPayment", "Refund Payment", "fa fa-undo", "Mark a payment as refunded"],
    ["reviewClaim", "Review Claim", "fa fa-search", "Move a claim into review"],
    ["ApproveClaim", "Approve Claim", "fa fa-check", "Approve an insurance claim"],
    ["RejectClaim", "Reject Claim", "fa fa-times", "Reject an insurance claim"],
    ["payClaim", "Pay Claim", "fa fa-money-bill", "Mark an approved claim as paid"],
    ["closeClaim", "Close Claim", "fa fa-lock", "Close a claim"],
    ["startTask", "Start Task", "fa fa-play", "Move a task into progress"],
    ["completeTask", "Complete Task", "fa fa-check", "Mark a task as complete"],
    ["approveInquiry", "Approve Inquiry", "fa fa-thumbs-up", "Approve a material inquiry"],
    ["declineInquiry", "Decline Inquiry", "fa fa-thumbs-down", "Decline a material inquiry"],
  ];

  await ExtraAction.deleteMany({ name: { $in: ["view", "edit", "delete", "assign", "resolve"] } });

  for (const [name, label, icon, description] of extraActions) {
    extraActionDocs[name] = await upsertAndSet(ExtraAction, { name }, { name, label, icon, description });
  }

  const roleDocs = {};
  for (const [roleName, description] of roles) {
    roleDocs[roleName] = await upsert(Role, { roleName }, { roleName, description });
  }

  for (const role of Object.values(roleDocs)) {
    for (const module of Object.values(moduleDocs)) {
      const workflowActionsByModule = {
        reports: ["assignFault", "resolveFault", "closeReport"],
        allocations: ["startWork", "resolveFault"],
        orders: ["processOrder", "shipOrder", "deliverOrder"],
        payments: ["completePayment", "refundPayment"],
        claims: ["reviewClaim", "ApproveClaim", "RejectClaim", "payClaim", "closeClaim"],
        tasks: ["startTask", "completeTask"],
        material_inquiries: ["approveInquiry", "declineInquiry"],
      };
      const moduleActionNames = workflowActionsByModule[module.moduleName] || [];
      await upsertAndSet(
        Permission,
        { role: role._id, module: module._id },
        {
          role: role._id,
          module: module._id,
          create: true,
          read: true,
          update: true,
          delete: true,
          extraActions: moduleActionNames.map((actionName) => extraActionDocs[actionName]._id.toString()),
        }
      );
    }
  }

  await upsert(SystemConfig, { appName: process.env.APP_NAME || "MMS" }, {
    logo: process.env.LOGO_URL || "",
    appName: process.env.APP_NAME || "MMS",
    appVersion: "1.0.0",
    appLanguage: "en",
    loginPageLayout: "DefaultLayout",
    maintenanceMode: false,
    appDescription: "Management system",
    maintenanceMessage: "System is under maintenance",
  });

  await upsert(CompanyConfig, { companyName: process.env.COMPANY_NAME || "MMS" }, {
    companyName: process.env.COMPANY_NAME || "MMS",
    companyAddress: "Company Address",
    companyLocation: "Company Location",
    companyMotto: "Company Motto",
    companyEmails: [{ name: "Info", email: process.env.COMPANY_EMAIL || "info@mms.local" }],
    companyPhoneNumbers: [{ name: "Main", phoneNumber: process.env.COMPANY_PHONE || "+265000000000" }],
  });

  const hashedPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD || "0000", 10);
  for (const [fullname, email, roleName] of sampleUsers) {
    await upsert(User, { email }, {
      undefined: "",
      fullname,
      email,
      password: hashedPassword,
      phoneNumber: "+265000000000",
      dateOfBirth: new Date("1990-01-01"),
      recruitmentDate: new Date(),
      role: roleDocs[roleName]._id,
      status: active._id,
      gender: male._id,
      description: `${roleName} sample user`,
      isAccountActive: true,
      fcmTokens: [],
    });
  }

  const faultDocs = {};
  const faults = [
    ["Power outage", "electrical", "No power or intermittent power in a room, block, or shared area."],
    ["Leaking tap", "plumbing", "Water leak from a tap, pipe, sink, or washroom fitting."],
    ["Broken door lock", "mechanical", "Door lock, hinge, latch, or access hardware is damaged."],
    ["General maintenance", "other", "General maintenance issue that does not fit another category."],
  ];

  for (const [faultName, faultType, description] of faults) {
    faultDocs[faultName] = await upsert(Fault, { faultName }, { faultName, faultType, description });
  }

  const locationDocs = {};
  const locations = [
    ["Administration Block", "Main office and administrative service area."],
    ["Hostel Block A", "Residential block A and surrounding shared spaces."],
    ["Workshop", "Maintenance workshop and equipment storage area."],
  ];

  for (const [locationName, description] of locations) {
    locationDocs[locationName] = await upsert(Location, { locationName }, { locationName, description });
  }

  const caretakerUser = await User.findOne({ email: "caretaker@mms.local" });
  const reporterUser = await User.findOne({ email: "reporter@mms.local" });
  const adminUser = await User.findOne({ email: "admin@mms.local" });

  const caretakerDocs = {};
  const caretakers = [
    ["Electrical Caretaker", "electrical.caretaker@mms.local", "+265000000001", "electrical", ["Administration Block", "Hostel Block A"]],
    ["Plumbing Caretaker", "plumbing.caretaker@mms.local", "+265000000002", "plumbing", ["Hostel Block A", "Workshop"]],
  ];

  for (const [fullName, email, phone, specialization, assignedLocationNames] of caretakers) {
    caretakerDocs[email] = await upsert(Caretaker, { email }, {
      fullName,
      email,
      phone,
      specialization,
      assignedLocations: assignedLocationNames.map((locationName) => locationDocs[locationName]._id.toString()),
      status: "active",
      notes: `${specialization} caretaker seeded for fault reporting.`,
    });
  }

  const sampleReports = [
    {
      key: "admin-power-outage",
      faults: ["Power outage"],
      reportDate: new Date(),
      description: "Power has been off in the administration block since this morning.",
      email: reporterUser?.email || "reporter@mms.local",
      location: locationDocs["Administration Block"]._id,
      priority: "high",
      status: "open",
    },
    {
      key: "hostel-leaking-tap",
      faults: ["Leaking tap"],
      reportDate: new Date(),
      description: "A tap is leaking continuously in Hostel Block A.",
      email: "student@mms.local",
      location: locationDocs["Hostel Block A"]._id,
      priority: "medium",
      status: "open",
    },
  ];

  const reportDocs = {};
  for (const report of sampleReports) {
    reportDocs[report.key] = await upsert(Report, { email: report.email, description: report.description }, {
      faults: report.faults.map((faultName) => faultDocs[faultName]._id.toString()),
      reportDate: report.reportDate,
      description: report.description,
      email: report.email,
      location: report.location,
      priority: report.priority,
      status: report.status,
    });
  }

  await upsert(Feedback, { report: reportDocs["admin-power-outage"]._id }, {
    report: reportDocs["admin-power-outage"]._id,
    feedbackDate: new Date(),
    comment: "Fault report received and assigned to maintenance.",
  });

  await upsert(Allocation, { report: reportDocs["admin-power-outage"]._id }, {
    report: reportDocs["admin-power-outage"]._id,
    location: locationDocs["Administration Block"]._id,
    assignedTo: caretakerUser?._id,
    materials: [
      { material: "Circuit breaker", quantity: 1 },
      { material: "Insulation tape", quantity: 2 },
    ],
    status: "pending",
  });

  await upsert(ActivityLog, { action: "seed:fault-reporting" }, {
    action: "seed:fault-reporting",
    description: "Seeded fault reporting roles, users, resources, reports, and allocation data.",
  });

  await upsert(SystemLog, { action: "Seed", user: "system" }, {
    action: "Seed",
    user: "system",
    status: "Success",
  });

  if (adminUser) {
    await upsert(Notification, { title: "Fault reporting seeded", recipient: adminUser._id }, {
      title: "Fault reporting seeded",
      body: "Fault reporting roles, users, reports, caretakers, and allocation data are ready.",
      icon: "",
      read: false,
      recipient: adminUser._id,
    });
  }

  console.log("Seed complete.");
  console.table(sampleUsers.map(([fullname, email, role]) => ({ fullname, email, role, password: process.env.SEED_USER_PASSWORD || "0000" })));
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
