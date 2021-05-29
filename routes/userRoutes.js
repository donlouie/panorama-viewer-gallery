const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const User = require('../models/userModel');
const userController = require('../controllers/userController');

//* @route GET
//? @desc Render create user form
//* @route POST
//? @desc Create user
router
  .route('/register')
  .get(userController.renderRegister)
  .post(userController.createUser);

//* @route GET
//? @desc Render login form
//* @route POST
//? @desc Login User
router
  .route('/login')
  .get(userController.renderLogin)
  .post(userController.loginUser);

//* @route GET
//? @desc Logout User
router.route('/logout').get(userController.logoutUser);

module.exports = router;
