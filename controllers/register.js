const User = require('../models/users.js');

exports.registroView = ('/', async (req, res) => {
  res.render('register');
});

exports.registro = ('/', async (req, res) => {
  console.log(req.body);
  try {
    let user_data = req.body;
    let nombre = user_data.nombre.trim();
    let email = user_data.email.trim();
    let password = user_data.email.trim();
    let password_confirm = user_data.password_confirm.trim();
    let terms = user_data.terms.trim();
    
  } catch (err) {

  }
});
