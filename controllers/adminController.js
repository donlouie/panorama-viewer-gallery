const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');

//* @route GET
//? @desc Render dashboard info page
exports.renderInfo = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);
    // console.log(currentUser.name);
    res.render('admin/info', { currentUser: currentUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
