const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/users.js');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/kroma'); 

const mapa = require('./routes/mapa');
const sesion = require('./routes/sesion');
const perfil = require('./routes/perfil');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'shh', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      req.user = user; // Set req.user for use in routes and controllers
      res.locals.user = user; // This makes 'user' available in all .pug views
    } catch (err) {
      console.error(err);
    }
  }
  next();
});

app.use('/', sesion);

app.use('/mapa', mapa);
app.use('/perfil', perfil);

app.use((req,res) => {
	res.send('Not found');
})

app.listen(3000);
