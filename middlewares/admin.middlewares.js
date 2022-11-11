const jwt = require('jsonwebtoken');
const { Admin } = require('../models/admin.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectTokenAdmin = catchAsync(async (req, res, next) => {
  let token;

  // Extract token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // ['Bearer', 'token']
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Session invalid', 403));
  }

  // Validate token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
  const user = await Admin.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token is no longer availablexxx', 403)
    );
  }

  req.sessionUser = user;
  next();
});

const adminExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Admin.findOne({
    where: { id, status: 'active' },
    //attributes: { exclude: ['password'] },
  });

  if (!user) {
    return next(new AppError(`User not found given that id: ${id}`, 404));
  }

  // Add user data to the req object
  req.user = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  // Get current session user and the user that is going to be updated
  const { sessionUser, user } = req;

  // Compare the id's
  if (sessionUser.id !== user.id) {
    // If the ids aren't equal, return error
    return next(new AppError('You do not own this account', 403));
  }

  // If the ids are equal, the request pass
  next();
});

module.exports = {
  adminExists,
  protectTokenAdmin,
  protectAccountOwner,
};