async function sanitizeData(data) {
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
  
    // Process each item in the data array
    const sanitizedData = await Promise.all(data.map(async (item) => {
      const sanitizedItem = {};
  
      // Copy only the fields that are not id, _id, password, __v, -v
      Object.keys(item).forEach(key => {
        if (!['id', '_id', 'undefined', 'password', '__v', '-v'].includes(key)) {
          sanitizedItem[key] = item[key];
        }
      });
  
      // Format date fields to human-readable format
      Object.keys(sanitizedItem).forEach(key => {
        if (sanitizedItem[key] && !isNaN(Date.parse(sanitizedItem[key]))) {
          sanitizedItem[key] = formatDate(sanitizedItem[key]);
        }
      });
  
      // Sanitize rich text fields
      Object.keys(sanitizedItem).forEach(key => {
        if (typeof sanitizedItem[key] === 'string' && sanitizedItem[key].startsWith('<')) {
          sanitizedItem[key] = sanitizeRichText(sanitizedItem[key]);
        }
      });
  
      return sanitizedItem;
    }));
  
    return sanitizedData;
  }
  
  export default sanitizeData;
  