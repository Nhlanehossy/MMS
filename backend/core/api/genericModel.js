const mongoose = require("mongoose");

exports.generateModel = (resourceName,schema) => {
  try {
    const resourceModel = mongoose.model(resourceName, schema);
    return resourceModel;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
