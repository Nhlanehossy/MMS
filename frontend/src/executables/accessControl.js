import axios from "axios";
import { Resources } from "../data/resources";
import { translationKeys } from "./translation";

export async function getFilteredResources(roleId) {
  try {
    // Fetch data from all four endpoints
    const [modulesResponse, permissionsResponse, rolesResponse, extraActionsResponse] = await Promise.all([
      axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/modules?limit=1000`),
      axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/permissions?limit=1000`),
      axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/roles?limit=1000`),
      axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/extra-actions?limit=1000`),
    ]);

    const modules = modulesResponse.data.data;
    const permissions = permissionsResponse.data.data;
    const roles = rolesResponse.data.data;
    const extraActions = extraActionsResponse.data.data;

    // Find the role object based on the parsed roleId
    const role = roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Filter permissions for the given role
    const rolePermissions = permissions.filter(p => p.role === roleId);

    // Filter and modify resources
    const filteredResources = Resources.filter(resource => {
      const moduleId = modules.find(m => m.moduleName === resource.path)?.id;
      if (!moduleId) return false;

      const permission = rolePermissions.find(p => p.module === moduleId);
      if (!permission) return false;

      // Modify actions based on permissions
      resource.actions = [];

      // Add create action if applicable
      if (permission.create && resource.renderMode === "crud") {
        resource.actions.push({ name: "createResource", icon: "pi pi-plus", label: translationKeys.Create || "Create" });
      }

      if (permission.read) {
        resource.actions.push({ name: "goToView", icon: "pi pi-eye", label: translationKeys.View || "View" });
      }
      if (permission.update) {
        resource.actions.push({ name: "goToEdit", icon: "pi pi-pencil", label: translationKeys.Edit || "Edit" });
      }

      // Add extra actions
      if (permission.extraActions && permission.extraActions.length > 0) {
        const permissionExtraActions = extraActions.filter(ea => permission.extraActions.includes(ea.id));
        permissionExtraActions.forEach(action => {
          resource.actions.push({
            name: action.name,
            icon: action.icon,
            label: action.label
          });
        });
      }

      // Add delete action last if applicable
      if (permission.delete) {
        resource.actions.push({ name: "deleteResource", icon: "pi pi-trash", label: translationKeys.Delete || "Delete" });
      }

      return true;
    });

    return filteredResources;
  } catch (error) {
    console.error('Error fetching and filtering resources:', error);
    throw error;
  }
}