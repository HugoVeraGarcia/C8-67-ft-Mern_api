const { body, validationResult } = require('express-validator');

const createEnterpriseValidations = [
  body('enterprisename')
    .notEmpty()
    .withMessage('Enterprise name cannot be empty'),
  body('foodtype').notEmpty().withMessage('foodtype cannot be empty'),
  body('country').notEmpty().withMessage('country cannot be empty'),
  body('prefphone').notEmpty().withMessage('prefix number cannot be empty'),
  body('phone').notEmpty().withMessage('phone cannot be empty'),
  body('address').notEmpty().withMessage('address cannot be empty'),
  body('typeperson').notEmpty().withMessage('typeperson cannot be empty'),
  body('enterpriserfc').notEmpty().withMessage('enterpriserfc cannot be empty'),
  body('legalreprefirstname')
    .notEmpty()
    .withMessage('legalreprefirstname cannot be empty'),
  body('legalreprelastname')
    .notEmpty()
    .withMessage('legalreprelastname cannot be empty'),
  body('reprerfc').notEmpty().withMessage('reprerfc cannot be empty'),
  body('identityrepre').notEmpty().withMessage('identityrepre cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const updateEnterpriseValidations = [
  // body('enterprisename')
  //   .notEmpty()
  //   .withMessage('Enterprise name cannot be empty'),
  // body('foodtype').notEmpty().withMessage('foodtype cannot be empty'),
  // body('country').notEmpty().withMessage('country cannot be empty'),
  // body('prefphone').notEmpty().withMessage('prefix number cannot be empty'),
  // body('phone').notEmpty().withMessage('phone cannot be empty'),
  // body('address').notEmpty().withMessage('address cannot be empty'),
  // body('typeperson').notEmpty().withMessage('typeperson cannot be empty'),
  // body('enterpriserfc').notEmpty().withMessage('enterpriserfc cannot be empty'),
  // body('legalreprefirstname')
  //  .notEmpty()
  //  .withMessage('legalreprefirstname cannot be empty'),
  //body('legalreprelastname')
  //  .notEmpty()
  //  .withMessage('legalreprelastname cannot be empty'),
  // body('reprerfc').notEmpty().withMessage('reprerfc cannot be empty'),
  // body('identityrepre').notEmpty().withMessage('identityrepre cannot be empty'),
  body('email')
    //.notEmpty()
    //.withMessage('email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
];

// user enterprise and super user
const createUserEnterpriseValidations = [
  body('firstname').notEmpty().withMessage('Firstname cannot be empty'),
  body('lastname').notEmpty().withMessage('Lastname cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const updateUserEnterpriseValidations = [
  body('firstname').notEmpty().withMessage('First name cannot be empty'),
  body('lastname').notEmpty().withMessage('Last name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
];

const loginValidations = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(({ msg }) => msg);

    // [msg, msg, msg] -> 'msg. msg. msg'
    const errorMsg = messages.join('. ');

    return res.status(400).json({
      status: 'error',
      message: errorMsg,
    });
  }

  next();
};

const createProductValidations = [
  body('title').notEmpty().withMessage('Title cannot be empty'),
  body('description').notEmpty().withMessage('Description cannot be empty'),
  body('price')
    .notEmpty()
    .withMessage('Price cannot be empty')
    .isNumeric({ min: 0 })
    .withMessage('Price must be over 0'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty')
    .isNumeric({ min: 0 })
    .withMessage('Quantity must be at least 0'),
  body('categoryId')
    .notEmpty()
    .withMessage('categoryId cannot be empty')
    .isInt({ min: 1 })
    .withMessage('categoryId must be an integer greater or equal than 1'),
];

module.exports = {
  createUserEnterpriseValidations,
  createProductValidations,
  checkValidations,
  loginValidations,
  createEnterpriseValidations,
  updateEnterpriseValidations,
  updateUserEnterpriseValidations,
};
