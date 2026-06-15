const yup = require("yup");
const {user_management_system} = require("./modules/user_management_system/system")
const {system_settings} = require("./modules/system_settings/settings")
const {report_management_system} = require("./modules/report_management_system/reportManagementSystem")
const {e_commerce_management_system} = require("./modules/e-commerce_management_system/system")
const {insurance_claims_management_system} = require("./modules/insurance_claims_management_system/system")
const {construction_tracking_system} = require("./modules/ProjectManagemetSystem/projectManagementSystem")
const {chat_system} = require("./modules/chat_system/system")
exports.Resources = [

  ...user_management_system,
  ...report_management_system,
  ...e_commerce_management_system,
  ...insurance_claims_management_system,
  ...construction_tracking_system,
  ...chat_system,
  ...system_settings

];
