const User = require('../models/users.js');
const Level = require('../models/level.js');
const { JSDOM } = require('jsdom');

exports.list = async (req, res) => {
  try {
    const challenges = await Level.find({ isChallenge: true }).sort({ order: 1 });
    const completed = req.user.completedChallenges || [];

    const enhancedChallenges = challenges.map(c => {
      const isCompleted = completed.includes(c.order);
      const isUnlocked = (c.order === 1) || completed.includes(c.order - 1);
      return {
        ...c.toObject(),
        isCompleted,
        isUnlocked
      };
    });

    res.render('desafios', { challenges: enhancedChallenges });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.play = async (req, res) => {
  try {
    const challenge = await Level.findOne({ isChallenge: true, order: req.params.id });
    if (!challenge) return res.status(404).send('Challenge not found');

    const completed = req.user.completedChallenges || [];
    const isUnlocked = (challenge.order === 1) || completed.includes(challenge.order - 1);
    if (!isUnlocked) {
      return res.redirect('/desafios');
    }

    res.render('niveles', { level: challenge, isChallenge: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.complete = async (req, res) => {
  try {
    const challenge = await Level.findOne({ isChallenge: true, order: req.params.id });
    if (!challenge) return res.status(404).send('Challenge not found');

    const submittedCode = req.body.code || '';
    const validation = validateSolution(challenge, submittedCode);

    if (validation.success) {
      if (!req.user.completedChallenges) {
        req.user.completedChallenges = [];
      }

      if (!req.user.completedChallenges.includes(challenge.order)) {
        req.user.completedChallenges.push(challenge.order);

        let awardPoints = 400;
        if (challenge.difficulty === 'medium') {
          awardPoints = 600;
        } else if (challenge.difficulty === 'hard') {
          awardPoints = 800;
        }

        req.user.points = (req.user.points || 0) + awardPoints;
        req.user.nivel = Math.floor(Math.sqrt(req.user.points / 50)) + 1;

        await req.user.save();
      }

      res.redirect('/desafios');
    } else {
      res.render('niveles', {
        level: challenge,
        isChallenge: true,
        error: validation.message || 'Codi incorrecte. Torna-ho a intentar!'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

function validateSolution(level, submittedCode) {
  const { validationType, validationTests, solutionCode } = level;

  if (validationType === 'literal' || validationType === 'regex') {
    if (validationTests && validationTests.length > 0) {
      for (const test of validationTests) {
        if (test.type === 'regex') {
          const regex = new RegExp(test.expected, 'i');
          if (!regex.test(submittedCode)) {
            return { success: false, message: test.message || 'El codi no compleix el format requerit.' };
          }
        } else if (test.type === 'literal') {
          const normalizedExpected = test.expected.replace(/\s/g, '').toLowerCase();
          const normalizedSubmitted = submittedCode.replace(/\s/g, '').toLowerCase();
          if (!normalizedSubmitted.includes(normalizedExpected)) {
            return { success: false, message: test.message || 'El codi no és correcte.' };
          }
        }
      }
      return { success: true };
    }

    const target = solutionCode || '';
    if (validationType === 'regex') {
      const regex = new RegExp(target, 'i');
      if (regex.test(submittedCode)) return { success: true };
    } else {
      const normalizedSolution = target.replace(/\s/g, '').toLowerCase();
      const normalizedSubmission = submittedCode.replace(/\s/g, '').toLowerCase();
      if (normalizedSubmission.includes(normalizedSolution)) return { success: true };
    }
    return { success: false, message: 'El codi no és correcte.' };
  }

  if (validationType === 'dom') {
    let htmlToParse;
    let runScripts = false;

    if (level.language === 'css') {
      htmlToParse = `<html><head><style>${submittedCode}</style></head><body>${level.htmlContext}</body></html>`;
    } else if (level.language === 'javascript') {
      htmlToParse = `<html><head><style>${level.cssContext || ''}</style></head><body>${level.htmlContext}</body></html>`;
      runScripts = true;
    } else {
      htmlToParse = submittedCode;
    }

    const dom = new JSDOM(htmlToParse, runScripts ? { runScripts: "dangerously", resources: "usable" } : {});
    const document = dom.window.document;

    if (runScripts) {
      try {
        dom.window.eval(submittedCode);
      } catch (e) {
        return { success: false, message: 'Error en executar el teu JavaScript: ' + e.message };
      }
    }

    for (const test of validationTests) {
      const element = test.selector ? document.querySelector(test.selector) : null;

      switch (test.type) {
        case 'selectorExists':
          if (!element) {
            return { success: false, message: test.message || `Falta l'element: ${test.selector}` };
          }
          break;

        case 'textContentMatch':
          if (!element) {
            return { success: false, message: test.message || `Falta l'element: ${test.selector}` };
          }
          const text = element.textContent.trim().toLowerCase();
          const expected = test.expected.trim().toLowerCase();
          if (text !== expected) {
            return { success: false, message: test.message || `El text de ${test.selector} no és correcte.` };
          }
          break;

        case 'attributeMatch':
          if (!element) {
            return { success: false, message: test.message || `Falta l'element: ${test.selector}` };
          }
          const attrValue = element.getAttribute(test.attributeName);
          if (attrValue !== test.expected) {
            return { success: false, message: test.message || `L'atribut ${test.attributeName} de ${test.selector} no és correcte.` };
          }
          break;

        case 'styleMatch':
          if (!element) {
            return { success: false, message: test.message || `Falta l'element: ${test.selector}` };
          }
          const style = dom.window.getComputedStyle(element);
          const actualValue = style[test.propertyName];
          if (actualValue !== test.expected) {
            return { success: false, message: test.message || `La propietat ${test.propertyName} de ${test.selector} ha de ser ${test.expected}.` };
          }
          break;

        case 'regex':
          const regex = new RegExp(test.expected, 'i');
          if (!regex.test(submittedCode)) {
            return { success: false, message: test.message || 'El codi no compleix el format requerit.' };
          }
          break;
      }
    }
    return { success: true };
  }

  return { success: false, message: 'Tipus de validació desconegut.' };
}
