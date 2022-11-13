const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  userEnterpriseExists,
  userDeletedEnterpriseExists,
  enterpriseExists,
  enterpriseDeletedExists,
  protectTokenUserEnterprise,
  //protectEmployee,
  protectAccountOwner,
  userEnterpriseExistsUpdate,
} = require('../middlewares/usersEnterprises.middlewares');
//
const { 
  createUserEnterpriseValidations,
  updateUserEnterpriseValidations,
  createEnterpriseValidations,
  updateEnterpriseValidations,
  checkValidations,
  loginValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createUserEnterprise,
  updateUserEnterprise,
  deleteUserEnterprise,
  activeUserEnterprise,
  login,
  //getProducts,
  //getAllOrders,
  //getOrderById,
  createEnterprise,
  getAllEnterprise,
  getEnterpriseById,
  deleteEnterprise,
  activateEnterprise,
  updateEnterprise,
  getUserEnterpriseById,
  getAllUsersEnterpriseById,
} = require('../controllers/userEnterprise.controller');

//router declaration
const router = express.Router();

// creater user enterprise
router.post(
  '/',
  createUserEnterpriseValidations,
  checkValidations,
  createUserEnterprise
);

// login user enterprise
router.post('/login', loginValidations, checkValidations, login);

//create enterprise
router.post(
  '/enterprise',
  createEnterpriseValidations,
  checkValidations,
  createEnterprise
);

// Apply protectToken middleware
router.use(protectTokenUserEnterprise);

// get all enterprise
router.get('/enterprise', getAllEnterprise);

// get all users from one enterprise by id
router.get('/:id', enterpriseExists, getAllUsersEnterpriseById);

// get enterprise by id
router.get('/enterprise/:id', enterpriseExists, getEnterpriseById);

// delete enterprise
router.delete('/enterprise/:id', enterpriseExists, deleteEnterprise);

// activated enterprise
router.patch('/enterprise_active/:id', activateEnterprise);

//update enterprise
router.patch(
  '/enterprise/:id',
  enterpriseExists,
  updateEnterpriseValidations,
  checkValidations,
  updateEnterprise
);

// get one user from one enterprise
router.get('/user/:id', userEnterpriseExists, getUserEnterpriseById);

// delete one user from one enterprise
router.delete('/:id', userEnterpriseExists, deleteUserEnterprise);

// activate one user from one enterprise
router.get('/active/:id', userDeletedEnterpriseExists, activeUserEnterprise);

// update one user from one enterprise
router.patch(
  '/',
  updateUserEnterpriseValidations,
  userEnterpriseExistsUpdate,
  checkValidations,
  updateUserEnterprise
);

module.exports = { userEnterpriseRouter: router };
