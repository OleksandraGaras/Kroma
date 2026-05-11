const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register');

router.get('/register', registerController.registroView);
router.post('/register', registerController.registro);

router.get('/', (req,res) => {
	res.redirect('/register');
});

router.get('/singin', registerController.singinView);
router.post('/singin', registerController.login);

module.exports = router;