const express = require('express');
const router = express.Router();
const mapaController = require('../controllers/mapa');

router.get('/', mapaController.global);

module.exports = router;