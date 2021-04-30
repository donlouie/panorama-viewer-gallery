const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const Panorama = require('../models/panoramaModel');
const panoramaController = require('../controllers/panoramaController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//* @route GET
//? @desc Show panorama list
router.get('/', panoramaController.showPanorama);


//* @route GET
//? @desc Render panorama create form
//* @route POST
//? @desc Create new panorama
router
  .route('/create')
  .get(panoramaController.renderNewForm)
  .post(upload.array('image'), panoramaController.createPanorama);

//* @route GET
//? @desc Show panorama detail
//* @route DELETE
//? @desc Delete panorama
router
  .route('/:id')
  .get(panoramaController.showDetail)
  .delete(panoramaController.deletePanorama);

module.exports = router;
