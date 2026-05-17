const express = require('express');
const router = express.Router();
const desafiosController = require('../controllers/desafios');

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/singin');
};

router.get('/', ensureAuthenticated, desafiosController.list);
router.get('/nivel/:id', ensureAuthenticated, desafiosController.play);
router.post('/nivel/:id/complete', ensureAuthenticated, desafiosController.complete);

module.exports = router;
