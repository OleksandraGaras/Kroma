const express = require('express');
const router = express.Router();
const paletaController = require('../controllers/paleta');

const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/singin');
};

router.get('/', ensureAuthenticated, paletaController.paletaView);

module.exports = router;
