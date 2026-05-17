exports.paletaView = (req, res) => {
  if (!req.user) {
    return res.redirect('/singin');
  }

  const completedLevels = req.user.completedLevels || [];
  const completedChallenges = req.user.completedChallenges || [];

  const colors = [
    {
      id: 'red',
      name: 'HTML',
      hex: '#e34c26',
      unlocked: completedLevels.some(o => o >= 1 && o <= 4),
      reqMsg: 'Completa niveles HTML (1-4)'
    },
    {
      id: 'orange',
      name: 'HTML Avanzado',
      hex: '#ef6c00',
      unlocked: completedLevels.some(o => o === 5 || o === 6),
      reqMsg: 'Completa niveles HTML Avz (5-6)'
    },
    {
      id: 'yellow',
      name: 'CSS',
      hex: '#f9a825',
      unlocked: completedLevels.some(o => o >= 7 && o <= 10),
      reqMsg: 'Completa niveles CSS (7-10)'
    },
    {
      id: 'green',
      name: 'JavaScript',
      hex: '#2ecc71',
      unlocked: completedLevels.some(o => o >= 11 && o <= 13),
      reqMsg: 'Completa niveles JS (11-13)'
    },
    {
      id: 'blue',
      name: 'Neon Rain',
      hex: '#3498db',
      unlocked: completedChallenges.includes(1),
      reqMsg: 'Completa Repte 1 (Desafíos)'
    },
    {
      id: 'purple',
      name: 'Spectrum',
      hex: '#9b59b6',
      unlocked: completedChallenges.includes(2),
      reqMsg: 'Completa Repte 2 (Desafíos)'
    },
    {
      id: 'cyan',
      name: 'Prismatic',
      hex: '#1abc9c',
      unlocked: completedChallenges.includes(3),
      reqMsg: 'Completa Repte 3 (Desafíos)'
    }
  ];

  res.render('paleta', { colors });
};
