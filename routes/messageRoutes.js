const express = require('express');
const router = express.Router();

const Message = require('../models/messageModel');
const messageController = require('../controllers/messageController');

//* @route POST
//? @desc Create new message
router
    .route('/create')
    .get(messageController.renderNewForm)
    .post(messageController.createMessage);

module.exports = router;
