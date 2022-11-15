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
  isUserEnterpriseAdmin,
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
  getIdEnterpriseByUser,
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

// create user enterprise
router.post(
  '/',
  isUserEnterpriseAdmin,
  createUserEnterpriseValidations,
  checkValidations,
  createUserEnterprise
);

//create enterprise
router.post(
  '/enterprise',
  createEnterpriseValidations,
  checkValidations,
  createEnterprise
);

// login user enterprise
router.post('/login', loginValidations, checkValidations, login);

// get Id enterprise by user id
router.get('/myEnterprise/:id', getIdEnterpriseByUser);

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
router.patch(
  '/enterprise_active/:id',
  enterpriseDeletedExists,
  activateEnterprise
);

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
router.delete(
  '/:id',
  isUserEnterpriseAdmin,
  userEnterpriseExists,
  deleteUserEnterprise
);

// activate one user from one enterprise
router.patch(
  '/active/:id',
  isUserEnterpriseAdmin,
  userDeletedEnterpriseExists,
  activeUserEnterprise
);

// update one user from one enterprise
router.patch(
  '/',
  isUserEnterpriseAdmin,
  updateUserEnterpriseValidations,
  userEnterpriseExistsUpdate,
  checkValidations,
  updateUserEnterprise
);

module.exports = { userEnterpriseRouter: router };
