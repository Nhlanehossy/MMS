import { system_settings } from "../modules/system_settings/system_settings";
import { user_management_system } from "../modules/user_management_system/system";
import { report_management_system } from "../modules/report_management_system/reportManagementSystem";                       
export const Resources = [
...user_management_system,
...report_management_system,
...system_settings,
];
