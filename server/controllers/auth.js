const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const ejs = require('ejs');
const path = require('path');
const User = require('./../models/user');
const { hashPassword, comparePassword } = require('./../utils/auth');
const sendEmail = require('./../utils/mailer');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).json({ message: 'Name is required.' });

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    if (!password || password.length < 6)
      return res.status(400).json({
        message:
          'Password is required and Password must be at least 6 character long.',
      });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: true,
      message: 'Registration successful.',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Email and Password is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user found.' });

    const match = await comparePassword(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid Email or Password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      // secure: true
    });

    user.password = undefined;
    res.status(201).json({
      status: true,
      message: 'Login successful.',
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.clearCookie('_csrf');

    res.status(200).json({
      status: true,
      message: 'Signout successful.',
    });
  } catch (err) {
    console.log(err);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      status: true,
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const passwordResetCode = nanoid(6).toUpperCase();

    await User.findOneAndUpdate({ email }, { passwordResetCode });

    const message = await ejs.renderFile(
      path.join(__dirname, './../views/email-templates/password-reset.ejs'),
      { passwordResetCode }
    );

    try {
      await sendEmail({
        from: 'Edemy <no-reply@edemy.com>',
        to: user.email,
        subject: 'Reset password',
        html: message,
      });

      res.json({
        status: true,
        message: 'Password reset code sent successfully.',
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        res.status(500).json({
          status: false,
          message:
            'There was an error sending the email. Please try again later.',
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    if (!code) return res.status(400).json({ message: 'Code is required.' });

    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({
        message:
          'Password is required and Password must be at least 6 character long.',
      });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (code != user.passwordResetCode)
      return res.status(404).json({ message: 'Invalid code.' });

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    await user.save();

    res.json({
      status: true,
      message: 'Password updated successfully.',
    });
  } catch (err) {
    console.log(err);
  }
};
