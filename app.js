const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/kroma'); 

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/singup', (req,res) => {
	res.render('sing_in');
})

app.get('/register', (req,res) => {
	res.render('register')
})

app.get('/', (req,res) => {
	res.redirect('/singup');
});

app.post('/mapa', (req,res) => {
	res.render('mapa');
});

app.get('/perfil', (req,res) => {
	res.render('perfil');
});

app.use((req,res) => {
	res.send('Not found');
})

app.listen(3000);
