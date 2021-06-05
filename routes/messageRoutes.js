const express = require('express');
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

const Message = require('../models/messageModel');
const messageController = require('../controllers/messageController');

//* @route GET
//? @desc Render message create form
//* @route POST
//? @desc Create new message
router
  .route('/create')
  .get(messageController.renderNewForm)
  .post(messageController.createMessage);

//* @route GET
//? @desc Render message list
//* @route POST
//? @desc Delete panorama
router
  .route('/admin/list/:page')
  .get(ensureAuthenticated, messageController.renderList)
  .post(messageController.sendEmail)
  .delete(messageController.deleteMessage);

module.exports = router;
