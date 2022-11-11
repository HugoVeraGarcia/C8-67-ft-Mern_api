const express = require('express');
const { body } = require('express-validator');

//middleware
const {
  userEnterpriseExists,
  protectToken,
  //protectEmployee,
  protectAccountOwner,
} = require('../middlewares/usersenterprises.middlewares');
//
const {
  createUserEnterpriseValidations,
  checkValidations,
  loginValidations,
} = require('../middlewares/validations.middlewares');

//import controller functions
const {
  createUserEnterprise,
  updateUserEnterprise,
  deleteUserEnterprise,
  login,
  getProducts,
  getAllOrders,
  getOrderById,
} = require('../controllers/userEnterprise.controller');

//router declaration
const router = express.Router();

router.post('/login', loginValidations, checkValidations, login);

// Apply protectToken middleware
router.use(protectToken);

router.post(
  '/',
  createUserEnterpriseValidations,
  checkValidations,
  createUserEnterprise
);

router.get('/products', getProducts);

router.get('/orders', getAllOrders);

router.get('/orders/:id', getOrderById);

router
  .route('/:id')
  .patch(userEnterpriseExists, protectAccountOwner, updateUserEnterprise)
  .delete(userEnterpriseExists, protectAccountOwner, deleteUserEnterprise);

module.exports = { userEnterpriseRouter: router };
