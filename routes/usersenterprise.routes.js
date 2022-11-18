const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  enterpriseDeletedExists,
  enterpriseExists,
  isSuper,
  isSuperAdmin,
  userDeletedExists,
  userExists,
  protectToken,
  //protectAccountOwner,
  userExistsParams,
  enterpriseExistsParams,
} = require('../middlewares/usersEnterprises.middlewares');

// validations middlewares (input data)
const {
  createUserEnterpriseValidations,
  updateUserEnterpriseValidations,
  createEnterpriseValidations,
  updateEnterpriseValidations,
  checkValidations,
  loginValidations,
} = require('../middlewares/validations.middlewares');

// controllers functions
const {
  activateEnterprise,
  activeUserEnterprise,
  createEnterprise,
  createUserEnterprise,
  deleteEnterprise,
  deleteUserEnterprise,
  getAllEnterprise,
  getAllUsersEnterpriseById,
  getEnterpriseById,
  getIdEnterpriseByUser,
  getUserEnterpriseById,
  login,
  updateEnterprise,
  updateUserEnterprise,
} = require('../controllers/userEnterprise.controller');

//router declaration
const router = express.Router();

//create enterprise
router.post(
  '/enterprise',
  createEnterpriseValidations,
  checkValidations,
  createEnterprise
);

// login user enterprise
router.post('/login', loginValidations, checkValidations, login);

// Apply protectToken middleware
router.use(protectToken);

// create user enterprise
router.post(
  '/',
  isSuperAdmin,
  createUserEnterpriseValidations,
  checkValidations,
  createUserEnterprise
);

// get Id enterprise by user id
router.get('/myEnterprise/:id', isSuperAdmin, getIdEnterpriseByUser);

// get all enterprise
router.get('/enterprise', isSuper, getAllEnterprise);

// get all users from one enterprise by id
router.get('/:id', isSuperAdmin, enterpriseExistsParams, getAllUsersEnterpriseById);

// get enterprise by id
router.get('/enterprise/:id', isSuper, enterpriseExistsParams, getEnterpriseById);

// delete enterprise
router.delete('/enterprise/:id', isSuper, enterpriseExistsParams, deleteEnterprise);

// activated enterprise
router.patch(
  '/enterprise_active/:id',
  isSuper,
  enterpriseDeletedExists,
  activateEnterprise
);

//update enterprise
router.patch(
  '/enterprise/',
  updateEnterpriseValidations,
  checkValidations,
  isSuperAdmin,
  enterpriseExists,
  updateEnterprise
);

// get one user from one enterprise
router.get('/user/:id', userExists, getUserEnterpriseById);

// delete one user from one enterprise
router.delete('/:id', isSuperAdmin, userExists, deleteUserEnterprise);

// activate one user from one enterprise
router.patch(
  '/active/:id',
  isSuperAdmin,
  userDeletedExists,
  activeUserEnterprise
);

// update one user from one enterprise
router.patch(
  '/',
  updateUserEnterpriseValidations,
  checkValidations,
  isSuperAdmin,
  userExistsParams, // existe porque {id} va por body
  updateUserEnterprise 
);

module.exports = { userEnterpriseRouter: router };
