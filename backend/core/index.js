const {getResources, createResources, updateResources, deleteResources} = require('./api/genericController');
const {setupDynamicRoutes} = require('./api/genericRoute');
const {generateModel} = require('./api/genericModel');



module.exports={
    getResources,
    createResources,
    updateResources,
    deleteResources,
    setupDynamicRoutes,
    generateModel,

}