const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register');

router.get('/register', registerController.registroView);
router.post('/register', registerController.registro);

router.get('/', (req,res) => {
	res.redirect('/register');
});

router.get('/sing_in', (req,res) => {
	res.render('sing_in')
})

module.exports = router;