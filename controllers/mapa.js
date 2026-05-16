const User = require('../models/users.js');
const Level = require('../models/level.js');
const { JSDOM } = require('jsdom');

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
    
    // Optional: Redirect if language doesn't match
    if (level.language !== req.params.language) {
      return res.redirect(`/mapa/${level.language}/nivel/${level.order}`);
    }

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
    if (!level) return res.status(404).send('Level not found');

    // Optional: Check language
    if (level.language !== req.params.language) {
      return res.redirect(`/mapa/${level.language}/nivel/${level.order}`);
    }

    const submittedCode = req.body.code || '';
    const validation = validateSolution(level, submittedCode);

    if (validation.success) {
      // Update user progress if it's a new level
      if (req.user.nivel < level.order) {
        req.user.nivel = level.order;
        await req.user.save();
      }
      res.redirect('/mapa');
    } else {
      // Return to level with error
      res.render('niveles', { 
        level, 
        error: validation.message || 'Codi incorrecte. Torna-ho a intentar!' 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

/**
 * Validates the submitted code against the level's requirements.
 */
function validateSolution(level, submittedCode) {
  const { validationType, validationTests, solutionCode } = level;

  // 1. Literal/Regex validation on the code itself (if not DOM type)
  if (validationType === 'literal' || validationType === 'regex') {
    // If we have specific validationTests of type 'regex' or 'literal', use them
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

    // Fallback to solutionCode if no validationTests
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

  // 2. DOM validation (for HTML/CSS/JS)
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

    // If JS, we need to manually execute the script in the context
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


