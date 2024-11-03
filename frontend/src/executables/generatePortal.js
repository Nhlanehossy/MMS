import axios from 'axios';



export function processPortalResources(e_commerce_management_system) {
    const portals = [];
  
    for (const resource of e_commerce_management_system) {
      if (resource.isPortal) {
        const portalResource = resource;
        const referencingResources = [];
  
        // Find resources referencing the portal resource
        for (const otherResource of e_commerce_management_system) {
          if (otherResource !== portalResource) {
            for (const field of otherResource.schema) {
              if (field.type === 'ref' && field.resource === portalResource.name) {
                const resourceCopy = JSON.parse(JSON.stringify(otherResource));
                resourceCopy.pivot = {
                  field: field.name,
                  value: 'url_param'
                };
                referencingResources.push(resourceCopy);
                break;
              }
            }
          }
        }
  
        // Create the portal object
        const portalObject = {
          ...portalResource.portalDefinition,
          resources: referencingResources
        };
  
        portals.push(portalObject);
      }
    }
  
    return portals;
  }
  
