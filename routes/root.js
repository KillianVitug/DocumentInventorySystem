const express = require('express');
const router = express.Router();
const registerRoutes = require('./register');
const loginRoutes = require('./login');
const refreshRoutes = require('./refresh');
const logoutRoutes = require('./logout');
const authController = require('../controllers/authController');
const verifyJWT = require('../middleware/verifyJWT');

// Use the document routes for any document-related paths

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/refresh', refreshRoutes);
router.use('/logout', logoutRoutes);

router.get('/profile', verifyJWT, authController.getProfile);

module.exports = router;
