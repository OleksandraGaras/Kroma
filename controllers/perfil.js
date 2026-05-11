const User = require('../models/users.js');
const multer = require('multer');
const path = require('path');

exports.perfilView = async (req, res) => {
  // Si no hay sesión, podrías redirigir al login
  if (!res.locals.user) return res.redirect('/singin');
  res.render('perfil'); // 'user' ya está disponible en perfil.pug
};

// Configure where and how files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/users'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    // Rename file to avoid duplicates: user-ID-timestamp.jpg
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user._id}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });