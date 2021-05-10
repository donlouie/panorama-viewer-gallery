const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const { ensureAuthenticated } = require('../config/auth');

const Panorama = require('../models/panoramaModel');
const panoramaController = require('../controllers/panoramaController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//* @route GET
//? @desc Show panorama list
router.route('/').get(panoramaController.showPanorama);

//* @route GET
//? @desc Render info page
router
    .route('/admin/info')
    .get(ensureAuthenticated, panoramaController.renderInfo);

//* @route GET
//? @desc Render panorama create form
//* @route POST
//? @desc Create new panorama
router
    .route('/admin/create')
    .get(ensureAuthenticated, panoramaController.renderNewForm)
    .post(upload.array('image'), panoramaController.createPanorama);

//* @route GET
//? @desc Render panorama list
//* @route POST
//? @desc Delete panorama
router
    .route('/admin/list')
    .get(ensureAuthenticated, panoramaController.renderList)
    .post(panoramaController.deletePanorama);

//* @route GET
//? @desc Show panorama detail
router.route('/:id').get(panoramaController.showDetail);

//* @route GET
//? @desc Render edit campground form
//* @route PUT
//? @desc Update panorama
router
    .route('/admin/:id/edit')
    .get(ensureAuthenticated, panoramaController.renderEditForm)
    .put(upload.array('image'), panoramaController.updatePanorama);

module.exports = router;
