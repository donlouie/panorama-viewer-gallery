const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const Panorama = require('../models/panoramaModel');
const panoramaController = require('../controllers/panoramaController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//* Show Panorama List
router.get('/', panoramaController.showPanorama);

//* Render Panorama Create Form
//* Create Panorama
router
  .route('/create')
  .get(panoramaController.renderNewForm)
  .post(upload.array('image'), panoramaController.createPanorama);

//* Show Panorama Detail
router
  .route('/:id')
  .get(panoramaController.showDetail)
  .delete(panoramaController.deletePanorama);

module.exports = router;
