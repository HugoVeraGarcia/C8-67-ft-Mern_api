const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  isSuper,
  userExists,
  userDeletedExists,
  protectToken,
} = require('../middlewares/usersenterprises.middlewares');

// data validatos
const {
  createUserEnterpriseValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createSuper,
  deleteUserEnterprise,
  activeUserEnterprise,
  getAllSuper,
} = require('../controllers/userenterprise.controller');

//router declaration
const router = express.Router();

//create super pendiente con token y isSuper
router.post(
  '/',
  createUserEnterpriseValidations,
  checkValidations,
  createSuper
);

// Apply protectToken middleware
router.use(protectToken);

// get all superusers
router.get('/', isSuper, getAllSuper);

// activate super
router.patch('/:id', isSuper, userDeletedExists, activeUserEnterprise);

// delete super
router.delete('/:id', isSuper, userExists, deleteUserEnterprise);

module.exports = { adminRouter: router };
