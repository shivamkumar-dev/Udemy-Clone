const express = require('express');
const router = express.Router();
const { requireSignin } = require('../middlewares/auth');
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/current-user', requireSignin, authController.currentUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
