const express = require('express');
const router = express.Router();

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/singin');
};

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('sandbox');
});

module.exports = router;
