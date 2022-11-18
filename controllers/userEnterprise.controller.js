const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { AppError } = require('../utils/appError');

const { userEnterprise } = require('../models/userEnterprise.model');
const { Enterprise } = require('../models/enterprise.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');
const { Category } = require('../models/category.model');

// utils
const { catchAsync } = require('../utils/catchAsync');

// delete user by id and by enterprise
const deleteUserEnterprise = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({
    status: 'deleted',
  });
  res.status(201).json({
    status: 'success',
    message: `User account has been deleted`,
  });
});

// active one user from enterprise
const activeUserEnterprise = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({
    status: 'active',
  });
  res.status(200).json({
    status: 'success',
    message: `User account has been actived`,
  });
});

const getAllEnterprise = catchAsync(async (req, res, next) => {
  const enterprise = await Enterprise.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
    order: [['id', 'Asc']],
  });
  res.status(200).json({
    enterprise,
  });
});

const getAllSuper = catchAsync(async (req, res, next) => {
  const superUser = await userEnterprise.findAll({
    where: { status: 'active', role: 'super' },
    attributes: { exclude: ['password'] },
    order: [['id', 'Asc']],
  });
  res.status(200).json({
    superUser,
  });
});

const getIdEnterpriseByUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await userEnterprise.findOne({
    where: { status: 'active', id },
    attributes: { exclude: ['password'] },
  });

  const identerpriseid = user.enterpriseId;
  res.status(200).json({
    identerpriseid,
  });
});

// get one user from one enterprise
const getUserEnterpriseById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({ user });
});

// all users from one enterprise
const getAllUsersEnterpriseById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const users = await userEnterprise.findAll({
    where: { enterpriseId: id, status: 'active' },
    attributes: { exclude: ['password'] },
    include: { model: Enterprise, attributes: { exclude: ['password'] } },
    order: [['id', 'Asc']],
  });

  res.status(200).json({ users });
});

// falta endpoint
const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({ user });
});

const getEnterpriseById = catchAsync(async (req, res, next) => {
  const { enterprise } = req;

  enterprise.password = undefined;

  res.status(200).json({ enterprise });
});

const deleteEnterprise = catchAsync(async (req, res, next) => {
  const { enterprise } = req;

  await enterprise.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: `Enterprise account has been deleted`,
  });
});

const activateEnterprise = catchAsync(async (req, res, next) => {
  const { enterprise } = req;
  console.log(enterprise);

  await enterprise.update({ status: 'active' });

  res.status(201).json({
    status: 'success',
    message: `Enterprise account has been activated`,
  });
});

const createUserEnterprise = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, phone, password, role, enterpriseId } =
    req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await userEnterprise.create({
    firstname,
    lastname,
    email,
    password: hashPassword,
    phone,
    role,
    enterpriseId,
  });

  user.password = undefined;

  res.status(201).json({
    status: 'Success',
    message: 'User has been created',
    user,
  });
});

const createSuper = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, phone, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await userEnterprise.create({
    firstname,
    lastname,
    email,
    password: hashPassword,
    phone,
    role: 'super',
  });

  user.password = undefined;

  res.status(201).json({
    status: 'Success',
    message: 'Super User has been created',
    user,
  });
});

const updateUserEnterprise = catchAsync(async (req, res, next) => {
  const { user } = req;

  const { firstname, lastname, email } = req.body;

  await user.update({ firstname, lastname, email });
  res.status(200).json({ status: 'success', user });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await userEnterprise.findOne({
    where: { email, status: 'active' },
  });

  // Compare password with db
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 400));
  }

  // Generate JWT
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;

  res.status(200).json({ token, user });
});

const checkToken = catchAsync(async (req, res, next) => {
  res.status(200).json({ user: req.sessionUser });
});

const getProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const product = await Product.findAll({
    where: {},
    include: { model: Category },
  });
  res.status(200).json({
    product,
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const order = await Order.findAll({
    where: {},
  });
  res.status(200).json({
    order,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id, userEnterpiseId: sessionUser.id },
    include: {
      model: Cart,
      where: { status: 'active' },
      //   include: {
      //     model: ProductsInCart,
      //     //     where: { status: 'purchased' },
      //   },
    },
  });

  if (!order) {
    return next(new AppError(`Order not found given that id: ${id}`, 404));
  }

  res.status(200).json({
    order,
  });
});

const createEnterprise = catchAsync(async (req, res, next) => {
  const {
    enterprisename,
    foodtype,
    country,
    prefphone,
    phone,
    address,
    typeperson,
    enterpriserfc,
    legalreprefirstname,
    legalreprelastname,
    reprerfc,
    identityrepre,
    email,
    password,
  } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const enterprise = await Enterprise.create({
    enterprisename,
    foodtype,
    country,
    prefphone,
    phone,
    address,
    typeperson,
    enterpriserfc,
    legalreprefirstname,
    legalreprelastname,
    reprerfc,
    identityrepre,
    email,
    password: hashPassword,
  });

  const user = await userEnterprise.create({
    firstname: legalreprefirstname,
    lastname: legalreprelastname,
    email,
    phone,
    password: hashPassword,
    role: 'admin',
    enterpriseId: enterprise.id,
  });

  enterprise.password = undefined;
  user.password = undefined;

  res.status(201).json({
    status: 'Success',
    message: 'Enterprise has been created',
    enterprise,
    user,
  });
});

const updateEnterprise = catchAsync(async (req, res, next) => {
  const { enterprise } = req;
  const {
    enterprisename,
    foodtype,
    country,
    prefphone,
    phone,
    address,
    typeperson,
    enterpriserfc,
    legalreprename,
    legalreprelastname,
    reprerfc,
    identityrepre,
    email,
  } = req.body;

  await enterprise.update({
    enterprisename,
    foodtype,
    country,
    prefphone,
    phone,
    address,
    typeperson,
    enterpriserfc,
    legalreprename,
    legalreprelastname,
    reprerfc,
    identityrepre,
    email,
  });

  res.status(200).json({
    status: 'Success',
    message: 'Enterprise has been updated',
    enterprise,
  });
});

module.exports = {
  getUserById,
  createUserEnterprise,
  updateUserEnterprise,
  deleteUserEnterprise,
  activeUserEnterprise,
  login,
  getIdEnterpriseByUser,
  checkToken,
  getProducts,
  getAllOrders,
  getOrderById,
  createEnterprise,
  getAllEnterprise,
  getEnterpriseById,
  deleteEnterprise,
  activateEnterprise,
  updateEnterprise,
  getUserEnterpriseById,
  getAllUsersEnterpriseById,
  createSuper,
  getAllSuper,
};
