const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  protectTokenAdmin,
  adminExists,
} = require('../middlewares/admin.middlewares');

const {
  createUserValidations,
  checkValidations,
  loginValidations,
  createEnterpriseValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createUserAdmin,
  login,
  deleteAdmin,
  activateAdmin,
  createEnterprise,
  getAllAdmin,
} = require('../controllers/admin.controller');

//router declaration
const router = express.Router();

//create admin
router.post('/', createUserValidations, checkValidations, createUserAdmin);

// login admin
router.post('/login', loginValidations, checkValidations, login);

router.get('/', getAllAdmin);

router.patch('/:id', activateAdmin);

// Apply protectToken middleware
router.use(protectTokenAdmin);

//create enterprise
router.post(
  '/enterprise',
  createEnterpriseValidations,
  checkValidations,
  createEnterprise
);

// delete admin
router.route('/:id').delete(adminExists, deleteAdmin);

module.exports = { adminRouter: router };
