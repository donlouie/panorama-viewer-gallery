const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const Panorama = require('../models/panoramaModel');
const panoramaController = require('../controllers/panoramaController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', panoramaController.showPanorama);

router
  .route('/create')
  .get(panoramaController.renderNewForm)
  .post(upload.array('image'), panoramaController.createPanorama);

router.route('/:id').get(catchAsync(panoramaController.showDetail));

module.exports = router;
