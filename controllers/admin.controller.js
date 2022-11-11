const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { AppError } = require('../utils/appError');

const { User } = require('../models/user.model');
const { Admin } = require('../models/admin.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');
const { Enterprise } = require('../models/enterprise.model');

// utils
const { catchAsync } = require('../utils/catchAsync');
const { Category } = require('../models/category.model');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await Admin.findAll({ attributes: { exclude: ['password'] } });
  res.status(200).json({
    users,
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({ user });
});

const createUserAdmin = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await Admin.create({
    username,
    email,
    password: hashPassword,
  });

  user.password = undefined;

  res.status(201).json({
    status: 'Success',
    message: 'Admin has been created',
    user,
  });
});

const createEnterprise = catchAsync(async (req, res, next) => {
  const { enterprisename } = req.body;

  const enterprise = await Enterprise.create({
    enterprisename,
  });

  res.status(201).json({
    status: 'Success',
    message: 'Enterprise has been created',
    enterprise,
  });
});

const updateAdmin = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  await user.update({ username, email });
  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: `User account has been deleted`,
  });
});

const deleteAdmin = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'deleted' });

  res.status(201).json({
    status: 'success',
    message: `User account has been deleted`,
  });
});

const activateAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Admin.findOne({
    where: { id, status: 'deleted' },
    //attributes: { exclude: ['password'] },
  });

  await user.update({ status: 'active' });

  res.status(201).json({
    status: 'success',
    message: `User account has been activated`,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that user exists with given email
  const user = await Admin.findOne({
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
  const order = await Order.findAll({
    where: {},
  });
  res.status(200).json({
    order,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: { id },
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

const getAllAdmin = catchAsync(async (req, res, next) => {
  const user = await Admin.findAll({
    where: {},
  });
  res.status(200).json({
    user,
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateAdmin,
  checkToken,
  getProducts,
  getAllOrders,
  getOrderById,
  createUserAdmin,
  login,
  deleteAdmin,
  activateAdmin,
  createEnterprise,
  getAllAdmin,
};
