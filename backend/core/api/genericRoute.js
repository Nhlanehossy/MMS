const express = require("express");
const { generateModel } = require("./genericModel");
const {
  getResources,
  createResources,
  updateResources,
  deleteResource,
  deleteResources,
  getResourceById,
  searchResources,
  sortResources,
  getResourceCount,
  updateResourceFields,
  calculateField,
  getFieldOccurrences,
  filterByTimeRange,
  sendEmail,
  sendWebPushNotification,
  forecast,
  pay,
  login,
  register,
  getProfile,
  getMyResourceById,
  handleStripeWebhook,
  updatepassword,
  addFCMToken,
  removeFCMToken,
  getUserFCMTokens,
  sendPushNotification,
  checkAndUpdateFCMToken // Add this new import
} = require("./genericController");

const router = express.Router();
const { auth } = require("../../middlewares/authorization");
const { validateInputs } = require("../../middlewares/validation");
const { generateValidationSchema } = require("../../helpers/Validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function setupDynamicRoutes(resource) {
  const { name, endpoint, schema } = resource;
  const resourceModel = generateModel(name, schema);

  router.use((req, res, next) => {
    req.resourceModel = resourceModel;
    next();
  });

  // GET routes
  router.get(`/api/v1/${endpoint}`, getResources);
  router.get(`/api/v1/${endpoint}/filterByTime`, filterByTimeRange);
  router.get(`/api/v1/${endpoint}/fieldOcurrences`, getFieldOccurrences);
  router.get(`/api/v1/${endpoint}/calculate`, calculateField);
  router.get(`/api/v1/${endpoint}/count`, getResourceCount);
  router.get(`/api/v1/${endpoint}/get-by-id`, getMyResourceById);
  router.get(`/api/v1/${endpoint}/search`, searchResources);
  router.get(`/api/v1/${endpoint}/sort`, sortResources);
  router.get(`/api/v1/forecast`, forecast);
  router.get(`/api/v1/${endpoint}/:id`, getResourceById);
  
  
  
  // POST routes
  router.post(`/api/v1/${endpoint}`, createResources);
  router.post('/sendEmail', sendEmail);
  router.post('/sendWebPushNotification', sendWebPushNotification);
  router.post(`/api/v1/pay`, pay);
  
  // PUT and PATCH routes
  router.put(`/api/v1/${endpoint}/:id`, updateResources);
  router.put(`/api/v1/users/:id/updatePassword`, updatepassword);
  router.patch(`/api/v1/${endpoint}/:id`, updateResourceFields);

  // DELETE routes
  router.delete(`/api/v1/${endpoint}`, deleteResources);
  router.delete(`/api/v1/${endpoint}/:id`, deleteResource);

  // User routes
  router.post(`/api/v1/${endpoint}/register`, register);
  router.get(`/api/v1/${endpoint}/user`, auth, getProfile);
  router.post(`/api/v1/${endpoint}/login`, login );
// FCM Token routes - uniquely structured
  router.post(`/api/v1/fcm/${endpoint}/token`, addFCMToken);
  router.delete(`/api/v1/fcm/${endpoint}/token`, removeFCMToken);
  router.get(`/api/v1/fcm/${endpoint}/tokens/:userId`, getUserFCMTokens);
  router.post(`/api/v1/fcm/${endpoint}/notify`, sendPushNotification);
  
  // New route for checking and updating FCM token
  router.post(`/api/v1/fcm/${endpoint}/check-update-token`, checkAndUpdateFCMToken);

  return router;
}

module.exports = { setupDynamicRoutes };
