const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const { hashPassword, comparePassword } = require('./../utils/auth');

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
