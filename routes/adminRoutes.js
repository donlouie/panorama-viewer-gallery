const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const { ensureAuthenticated } = require('../config/auth');

const adminController = require('../controllers/adminController');

//* @route GET
//? @desc Render technical info page
router
  .route('/admin/info')
  .get(ensureAuthenticated, adminController.renderInfo);

module.exports = router;
