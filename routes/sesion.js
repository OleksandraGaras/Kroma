const express = require('express');
const router = express.Router();

router.get('/singin', (req,res) => {
  res.render('sing_in');
});

router.get('/', (req,res) => {
	res.redirect('/singin');
});

router.get('/register', (req,res) => {
	res.render('register')
})

module.exports = router;