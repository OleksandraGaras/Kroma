const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/kroma'); 

const mapa = require('./routes/mapa');
const sesion = require('./routes/sesion');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use('/', sesion);

app.use('/mapa', mapa);

app.get('/perfil', (req,res) => {
	res.render('perfil');
});

app.use((req,res) => {
	res.send('Not found');
})

app.listen(3000);
