const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middleware/validator');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
