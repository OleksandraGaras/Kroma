const express = require('express');
const router = express.Router();
const mapaController = require('../controllers/mapa');

router.get('/', mapaController.global);
router.get('/nivel/:id', mapaController.niveles)

module.exports = router;