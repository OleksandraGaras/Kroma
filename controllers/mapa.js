const User = require('../models/users.js');
const Level = require('../models/level.js');

exports.global = ('/',async (req, res) => {
  if (!res.locals.user) return res.redirect('/singin');
  res.render('mapa'); 
});

exports.niveles = ('/nivel/:id', async (req,res) => {
  if (!res.locals.user) return res.redirect('/singin');
  try {
    // We search by 'order' because the URLs use simple numbers (1, 2, 3...)
    const level = await Level.findOne({ order: req.params.id });
    if (!level) return res.status(404).send('Level not found');
    res.render('niveles', { level });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})


exports.completar = ('/nivel/:id/complete', async (req, res) => {
  if (!res.locals.user) return res.redirect('/singin');
  try {
    const level = await Level.findOne({ order: req.params.id });
    const submittedCode = req.body.code;


    // Simple validation: check if solution exists in submitted code (ignoring whitespace)
    const normalizedSolution = level.solutionCode.replace(/\s/g, '').toLowerCase();
    const normalizedSubmission = submittedCode.replace(/\s/g, '').toLowerCase();

    if (normalizedSubmission.includes(normalizedSolution)) {
      // Update user progress if it's a new level
      if (req.user.nivel < level.order) {
        req.user.nivel = level.order;
        await req.user.save();
      }
      res.redirect('/mapa');
    } else {
      // Return to level with error (could be improved with flash messages)
      res.render('niveles', { level, error: 'Codi incorrecte. Torna-ho a intentar!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})


