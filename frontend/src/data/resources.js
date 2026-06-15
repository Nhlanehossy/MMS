import { system_settings } from "../modules/system_settings/system_settings";
import { user_management_system } from "../modules/user_management_system/system";
import { report_management_system } from "../modules/report_management_system/reportManagementSystem";                       
import { e_commerce_management_system } from "../modules/e_commerce_system/system";
import { insurance_claims_management_system } from "../modules/insurance_claims_management_system/system";
import { construction_tracking_system } from "../modules/project_management_system/project_management_system";
import { chat_system } from "../modules/chat_system/chat_system";
export const Resources = [
...user_management_system,
...report_management_system,
...e_commerce_management_system,
...insurance_claims_management_system,
...construction_tracking_system,
...chat_system,
...system_settings,
];
