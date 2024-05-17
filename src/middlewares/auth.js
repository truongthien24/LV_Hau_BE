const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/TaiKhoan');
const APIError = require('../errors/api-error');

const ADMIN = 'admin';
const LOGGED_USER = '_loggedUser';

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
  } catch (e) {
    return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.loaiTaiKhoan !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(user.loaiTaiKhoan)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;

exports.authorize = (roles = User.loaiTaikhoan) => (req, res, next) => passport.authenticate(
  'jwt', { session: false },
  handleJWT(req, res, next, roles),
)(req, res, next);

exports.oAuth = (service) => passport.authenticate(service, { session: false });