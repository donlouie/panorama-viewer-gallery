const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//* @route GET
//? @desc Render login page
exports.renderLogin = (req, res, next) => {
  res.render('users/login');
};

//* @route GET
//? @desc Render create user form
exports.renderRegister = (req, res, next) => {
  res.render('users/register');
};

//* @route POST
//? @desc Create user
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //* Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  //* Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //* Check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be atleast 6 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //* Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: 'Email is already registered' });
        res.render('users/register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //* Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //* Set password to hashed
            newUser.password = hash;
            //* Save user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});
