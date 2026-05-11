const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.registroView = ('/', async (req, res) => {
  res.render('register');
});

exports.singinView = ('/sing_in', async (req, res) => {
  res.render('sing_in');
});

// La sintaxis correcta para exportar una función de controlador
exports.registro = async (req, res) => {
  const { nombre, email, password, password_confirm, terms } = req.body;

  const cleanData = {
    nombre: (nombre || "").trim(),
    email: (email || "").trim().toLowerCase(),
    password: (password || "").trim(),
    password_confirm: (password_confirm || "").trim(),
    terms: !!terms 
  };

  if (cleanData.password !== cleanData.password_confirm) {
    return res.status(400).send("Las contraseñas no coinciden");
  }

  try {
    const saltRounds = 10;
    
    const hash = await bcrypt.hash(cleanData.password, saltRounds);

    const saveData = {
      name: cleanData.nombre,
      email: cleanData.email,
      password: hash,
      terms: cleanData.terms
    };
    let user = new User(saveData);
    await user.save();
    
    res.redirect('/mapa');

  } catch (err) {
    console.error("Error al registrar:", err);
    res.status(500).send("Error interno del servidor");
  }
};


exports.login = async (req, res) => {
  try{
    const {email, password, remember} = req.body;

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    const user = await User.findOne({email:cleanEmail}).select('+password');

    if (!user){
      return res.status(401).json({ message: 'Credenciales incorrectas' }); //ahora lo hago asi, deberia de enviarle de vuelta al form con el error
    }

    const isMatch = await bcrypt.compare(cleanPassword, user.password);

    if (isMatch){
      res.redirect('/mapa');
      res.status(200).json({
          message: 'Login exitoso',
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
      });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
  
};
