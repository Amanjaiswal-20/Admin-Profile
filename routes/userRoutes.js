const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const { uploadUserPhoto, updatePhoto } = require('../controllers/userController')

router.route('/').post(userController.createUser);
router.route('/allProfiles').get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers);
router.route('/').get(authController.protect, userController.getMe);
router.route('/publicProfile').get(authController.protect, userController.getAllPublicUsers)
router.route("/").patch(authController.protect, userController.updateUsers);
router.route("/makeProfilePublic").patch(authController.protect, userController.makeProfilePublic)
router.route("/makeProfilePrivate").patch(authController.protect, userController.makeProfilePrivate)
router.route("/updatePhoto").patch(authController.protect, uploadUserPhoto, updatePhoto);

module.exports = router;