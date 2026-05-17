const User = require('../models/users.js');
const Level = require('../models/level.js');

exports.perfilView = async (req, res) => {
  if (!res.locals.user) return res.redirect('/singin');
  
  try {
    const user = req.user;
    const completedLevels = user.completedLevels || [];
    
    // Fetch all levels to calculate progress based on the database content
    const levels = await Level.find({});
    
    // Languages listed on the profile
    const languages = ['html', 'css', 'javascript', 'php', 'react'];
    const progress = {};
    
    languages.forEach(lang => {
      const langLevels = levels.filter(l => l.language === lang);
      const total = langLevels.length;
      const completed = langLevels.filter(l => completedLevels.includes(l.order)).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      let rank = 'Principiante';
      if (total === 0) {
        rank = 'Próximamente';
      } else if (percentage >= 100) {
        rank = 'Experto';
      } else if (percentage >= 70) {
        rank = 'Avanzado';
      } else if (percentage >= 35) {
        rank = 'Intermedio';
      } else if (percentage > 0) {
        rank = 'Iniciando';
      }
      
      progress[lang] = {
        percentage,
        rank,
        completed,
        total
      };
    });
    
    res.render('perfil', { progress });
  } catch (err) {
    console.error("Error cargando perfil:", err);
    res.status(500).send("Error interno del servidor al cargar el perfil");
  }
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