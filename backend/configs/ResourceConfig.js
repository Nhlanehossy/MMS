const yup = require("yup");
const {user_management_system} = require("./modules/user_management_system/system")
const {system_settings} = require("./modules/system_settings/settings")
const {report_management_system} = require("./modules/report_management_system/reportManagementSystem")
exports.Resources = [

  ...user_management_system,
  ...report_management_system,
  ...system_settings

];
