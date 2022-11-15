const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  protectTokenAdmin,
  adminExists,
} = require('../middlewares/admin.middlewares');

const {
  createUserValidations,
  createAdminValidations,
  checkValidations,
  loginValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createUserAdmin,
  login,
  deleteAdmin,
  activateAdmin,
  getAllAdmin,
} = require('../controllers/admin.controller');

//router declaration
const router = express.Router();

//create admin
router.post('/', createAdminValidations, checkValidations, createUserAdmin);

// login admin
router.post('/login', loginValidations, checkValidations, login);

// Apply protectToken middleware
router.use(protectTokenAdmin);

// get all superusers admin
router.get('/', getAllAdmin);

// activate admin
router.patch('/:id', activateAdmin);

// delete admin
router.delete('/:id', adminExists, deleteAdmin);

module.exports = { adminRouter: router };
