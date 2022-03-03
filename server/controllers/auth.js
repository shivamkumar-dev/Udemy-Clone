const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const ejs = require('ejs');
const path = require('path');
const User = require('../models/user');
const asyncHandler = require('../middlewares/async');
const { hashPassword, comparePassword } = require('../utils/auth');
const sendEmail = require('../utils/mailer');
const ErrorResponse = require('../utils/errorResponse');

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) return next(new ErrorResponse('Name is required', 400));

  if (!email) return next(new ErrorResponse('Email is required', 400));

  if (!password || password.length < 6)
    return next(
      new ErrorResponse(
        'Password is required and Password must be at least 6 character long',
        400
      )
    );

  const user = await User.findOne({ email : email.toLowerCase().trim()});
  if (user) return next(new ErrorResponse('Email already exists.', 400));

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword
  });

  res.status(201).json({
    status: true,
    message: 'Registration successful',
    data: {
      user: newUser
    }
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse('Email and Password is required', 400));

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return next(new ErrorResponse('User not found', 404));

  const match = await comparePassword(password, user.password);
  if (!match) return next(new ErrorResponse('Invalid Email or Password', 401));

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('token', token, {
    httpOnly: true
    // secure: true
  });

  user.password = undefined;
  res.status(200).json({
    status: true,
    message: 'Login successful',
    data: {
      user
    }
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');
  res.clearCookie('_csrf');

  res.status(200).json({
    status: true,
    message: 'Signout successful'
  });
});

exports.currentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    status: true,
    data: {
      user
    }
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorResponse('Email is required', 400));

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return next(new ErrorResponse('User not found', 404));

  const passwordResetCode = nanoid(6).toUpperCase();

  await User.findOneAndUpdate({ email: email.toLowerCase().trim() }, { passwordResetCode });

  const message = await ejs.renderFile(
    path.join(__dirname, './../views/email-templates/password-reset.ejs'),
    { passwordResetCode }
  );

  try {
    await sendEmail({
      from: 'Edemy <no-reply@edemy.com>',
      to: user.email,
      subject: 'Reset password',
      html: message
    });

    res.json({
      status: true,
      message: 'Password reset code sent successfully'
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      res.status(500).json({
        status: false,
        message: 'There was an error sending the email. Please try again later.'
      })
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  if (!email) return next(new ErrorResponse('Email is required', 400));

  if (!code) return next(new ErrorResponse('Code is required', 400));

  if (!newPassword || newPassword.length < 6)
    return next(
      new ErrorResponse(
        'Password is required and Password must be at least 6 character long',
        400
      )
    );

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return next(new ErrorResponse('User not found', 404));

  if (code != user.passwordResetCode)
    return next(new ErrorResponse('Invalid code', 400));

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  user.passwordResetCode = undefined;
  await user.save();

  res.json({
    status: true,
    message: 'Password updated successfully'
  });
});
