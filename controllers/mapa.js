const User = require('../models/users.js');

exports.global = ('/',async (req, res) => {
  if (!res.locals.user) return res.redirect('/singin');
  res.render('mapa'); 
});
