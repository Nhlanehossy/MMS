import axios from 'axios';

async function sanitizeData(data, resource, filters) {
  // Helper function to make API requests
  async function fetchFieldValue(resourceName, fieldName, id) {

    console.log(`Fetching ${resourceName} data...`);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/${resourceName}/${id}`);
      return response.data[fieldName];
    } catch (error) {
      console.error(`Error fetching ${resourceName} data:`, error);
      return null;
    }
  }

  // Collect all the ref and tags fields
  const refFields = resource.schema.filter(field => field.type === 'ref');
  const tagsFields = resource.schema.filter(field => field.type === 'tags');

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  }

  // Helper function to sanitize rich text
  function sanitizeRichText(text) {
    return text.replace(/<[^>]+>/g, '');
  }

  // Convert filter values to their actual values
  const filterValues = {};
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      const field = resource.schema.find(f => f.name === key);
      if (field) {
        filterValues[key] = await fetchFieldValue(field.resource, field.field, filters[key]);
      }
    }
  }

  // Process each item in the data array
  const sanitizedData = await Promise.all(data.map(async (item, index) => {
    const sanitizedItem = {};

    // Copy only the fields that are not id, _id, password, __v, -v
    Object.keys(item).forEach(key => {
      if (!['password', '__v', '-v'].includes(key)) {
        sanitizedItem[key] = item[key];
      }
    });

    // Format date fields to human-readable format
    Object.keys(sanitizedItem).forEach(key => {
      const value = sanitizedItem[key];
      if (typeof value === 'string') {
        // Regex to match ISO 8601 date formats
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/;
        if (dateRegex.test(value)) {
          sanitizedItem[key] = formatDate(value);
        } else if (value.startsWith('<')) {
          sanitizedItem[key] = sanitizeRichText(value);
        }
      }
    });
    
    // Sanitize rich text fields
    resource.schema.forEach(field => {
      if (field.type === 'richtext' && sanitizedItem[field.name]) {
        sanitizedItem[field.name] = sanitizeRichText(sanitizedItem[field.name]);
      }
    });

    // Replace ref fields with their actual values
    await Promise.all(refFields.map(async (field) => {
      if (item[field.name]) {
        sanitizedItem[field.name] = await fetchFieldValue(field.resource, field.field, item[field.name]);
      }
    }));

    // Replace tags fields with their actual values
    await Promise.all(tagsFields.map(async (field) => {
      if (Array.isArray(item[field.name])) {
        sanitizedItem[field.name] = await Promise.all(item[field.name].map(async (id) => {
          return await fetchFieldValue(field.resource, field.field, id);
        }));
      }
    }));

    return sanitizedItem;
  }));

  // Apply filters
  const filteredData = sanitizedData.filter(item => {
    for (const key in filterValues) {
      if (filterValues.hasOwnProperty(key) && item[key] !== filterValues[key]) {
        return false;
      }
    }
    return true;
  });

  return filteredData;
}

export default sanitizeData;
