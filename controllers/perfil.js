const User = require('../models/users.js');

exports.perfilView = async (req, res) => {
  // Si no hay sesión, podrías redirigir al login
  if (!res.locals.user) return res.redirect('/singin');
  res.render('perfil'); // 'user' ya está disponible en perfil.pug
};

exports.upladPicture = async (req,res) => {
  try {
    if (!req.file){
      return res.status(400).send('No se subió ninguna imagen.');
    }

    const imgPath = `/imgs/users/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, { profilepic: imgPath });

    console.log('Archivo guardado en:', req.file.path);
    res.redirect('/perfil');
  } catch (err) {
    res.status(500).send('Error al subir la imagen')
  }
};