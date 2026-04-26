const User = require('../models/users.js');

exports.global = ('/', async (req, res) => {
  res.render('mapa');
});
