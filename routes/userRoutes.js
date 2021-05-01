const express = require('express');
const router = express.Router();
const passport = require('passport');

const catchAsync = require('../utils/catchAsync');

const User = require('../models/userModel');
const userController = require('../controllers/userController');

//* @route GET
//? @desc Render create user form
//* @route POST
//? @desc Create user
router.route('/register').get(userController.renderRegister);
//   .post(catchAsync(users.register));

module.exports = router;
