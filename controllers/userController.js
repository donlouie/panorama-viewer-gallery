const User = require('../models/userModel');

//* @route GET
//? @desc Render create user form
exports.renderRegister = (req, res) => {
  res.render('users/register');
};

