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
router.route('/login').get(userController.renderLogin);

module.exports = router;
