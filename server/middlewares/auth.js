const expressJwt = require('express-jwt');

exports.requireSignin = expressJwt({
  getToken: (req, res, next) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});
