// app/routes

const express = require('express');
const { register ,login, logout, checkToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/check-token', checkToken);

module.exports = router;