const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const Panorama = require('../models/panoramaModel');
const panoramaController = require('../controllers/panoramaController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(panoramaController.showPanorama));

router
  .route('/create')
  .get(panoramaController.renderNewForm)
  .post(upload.array('image'), catchAsync(panoramaController.createPanorama));

module.exports = router;
