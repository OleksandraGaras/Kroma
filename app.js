
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

app.get('/', (req,res) => {
	res.render('sing_in');
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
