export function getDefaultValuesFromSchema(resource) {
    // Helper function to recursively get default values
    const getDefaultValues = (schema) => {
      let defaultValues = {};
  
      schema.forEach((field) => {
        // Check if the field has a nested schema (for nested objects)
        if (field.type === 'object' && field.schema) {
          // Recursively extract default values for the nested schema
          defaultValues[field.name] = getDefaultValues(field.schema);
        } 
        else if (field.type === 'array' && field.schema) {
          // If it's an array, return an empty array or populated default values
          defaultValues[field.name] = field.defaultValue || [];
        } 
        else {
          // Get the default value for a standard field
          defaultValues[field.name] = typeof field.defaultValue === 'function'
            ? field.defaultValue() // If defaultValue is a function, call it
            : field.defaultValue !== undefined
            ? field.defaultValue
            : getDefaultByType(field.type); // Fallback based on field type
        }
      });
  
      return defaultValues;
    };
  
    // A helper function that returns a sensible default value based on the field type
    const getDefaultByType = (type) => {
      switch (type) {
        case 'text':
        case 'richtext':
        case 'date':
        case 'select':
          return '';
        case 'number':
          return 0;
        case 'boolean':
          return false;
        case 'ref':
          return null; // Reference fields default to null
        case 'array':
          return [];
        case 'image array':
          return [];
        default:
          return null;
      }
    };
  
    // Check if the resource has a schema, and if so, compute the default values
    if (resource && resource.schema) {
      return getDefaultValues(resource.schema);
    }
  
    // If no schema is provided, return an empty object
    return {};
  }
  