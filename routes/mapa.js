const express = require('express');
const router = express.Router();
const mapaController = require('../controllers/mapa');

router.get('/', mapaController.global);
router.get('/:language/nivel/:id', mapaController.niveles);
router.post('/:language/nivel/:id/complete', mapaController.completar);


module.exports = router;