require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { setupDynamicRoutes } = require("./core");
const {generateMongooseSchemas} = require("./helpers/SchemaGenerator")
const nodecron = require('node-cron');
const axios = require('axios');


//DB Connection
require("./configs/dbConfig");
const {Resources}= require("./configs/ResourceConfig")
const generatedResources =  generateMongooseSchemas(Resources)
console.log(generatedResources[0].name, generatedResources[0].endpoint)
const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req, res)=>{
  console.log("hello backend")
  res.send("Hello Backend")
})

generatedResources.forEach((resource) => {
  app.use(setupDynamicRoutes(resource));
});


const port = process.env.PORT || 3000;
nodecron.schedule('*/10 * * * *', async () => {
  try {
    // Send an HTTP request to your Express application
    const response = await axios.get(`http://localhost:${port}`);
    console.log(`Status Code: ${response.status}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
