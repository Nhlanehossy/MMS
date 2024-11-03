import { Resources as AdminResources } from "./resources";
import { website_config } from "../modules/e_commerce_system/website";
import { processPortalResources } from "../executables/generatePortal";

import { e_commerce_management_system } from "../modules/e_commerce_system/system";

//export const derivedPortals = processPortalResources(e_commerce_management_system);

export const systemConfig = {
  name: "system-factory",
  defaultUrl: "/login",
  portals: [

    {
      name: "admin",
      url: "/dashboard",
      type: "default",
      icon: "fa fa-home",
      resources: AdminResources,
    },

    //...derivedPortals,
  ],
};
