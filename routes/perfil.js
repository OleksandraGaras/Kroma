const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil');
const multer = require('multer');
const path = require('path');

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/singin');
};

// Configure where and how files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/users'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    // Rename file to avoid duplicates: user-ID-timestamp.jpg
    const ext = path.extname(file.originalname);
    const userId = req.user ? req.user._id : 'guest';
    cb(null, `user-${userId}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage: storage });

router.get('/', perfilController.perfilView);
router.post('/upload-avatar', ensureAuthenticated, upload.single('avatar'), perfilController.upladPicture);

module.exports = router;