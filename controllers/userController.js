const User = require('../models/userModel');

//* @route GET
//? @desc Render create user form
exports.renderRegister = (req, res) => {
  res.render('users/register');
};

//* @route POST
//? @desc Create user
exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect('/campgrounds');
    });
  } catch (err) {
    res.redirect('/register');
  }
};
