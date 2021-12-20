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
        user,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
