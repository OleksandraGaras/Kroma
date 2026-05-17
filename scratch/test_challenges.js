const { JSDOM } = require('jsdom');

// Mock validation tests direct from database models
const neonRainChallenge = {
    language: "html",
    validationType: "dom",
    validationTests: [
        {
            type: "selectorExists",
            selector: ".neon-card",
            message: "Falta l'element amb la classe 'neon-card'."
        },
        {
            type: "regex",
            expected: "box-shadow\\s*:\\s*0\\s+0\\s+20px\\s+#ff007f",
            message: "L'ombra de neó ha de ser: box-shadow: 0 0 20px #ff007f;"
        },
        {
            type: "regex",
            expected: "background-color\\s*:\\s*#111",
            message: "El color de fons del card ha de ser #111."
        }
    ]
};

const spectrumSpinnerChallenge = {
    language: "css",
    htmlContext: `<div class="spinner"></div>`,
    validationType: "dom",
    validationTests: [
        {
            type: "selectorExists",
            selector: ".spinner",
            message: "Falta el selector .spinner en el teu CSS."
        },
        {
            type: "regex",
            expected: "border-radius\\s*:\\s*50%",
            message: "L'spinner ha de ser un cercle perfecte (border-radius: 50%)."
        },
        {
            type: "regex",
            expected: "@keyframes\\s+spin",
            message: "Has de crear l'animació @keyframes spin."
        },
        {
            type: "regex",
            expected: "transform\\s*:\\s*rotate\\(\\s*360deg\\s*\\)",
            message: "L'animació ha de rotar 360 graus (transform: rotate(360deg))."
        }
    ]
};

const prismaticWaveChallenge = {
    language: "javascript",
    htmlContext: `<button id="color-shifter">SHIFT COLOR ⚡</button>`,
    cssContext: "",
    validationType: "dom",
    validationTests: [
        {
            type: "selectorExists",
            selector: "#color-shifter",
            message: "Falta el botó amb ID color-shifter."
        },
        {
            type: "regex",
            expected: "addEventListener\\(\\s*['\"]click['\"]",
            message: "Has d'afegir un gestor d'esdeveniments click al botó."
        },
        {
            type: "regex",
            expected: "document\\.body\\.style\\.backgroundColor",
            message: "Has d'actualitzar document.body.style.backgroundColor."
        }
    ]
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

console.log("=== RUNNING COLOR CHALLENGES UNIT TESTS ===");

// TEST 1: Neon Rain HTML Challenge
console.log("\n--- TEST 1: Neon Rain HTML ---");
const validHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .neon-card {
            width: 200px;
            height: 200px;
            background-color: #111;
            border-radius: 12px;
            box-shadow: 0 0 20px #ff007f;
        }
    </style>
</head>
<body>
    <div class="neon-card"></div>
</body>
</html>
`;
const invalidHTML = `
<div>No card here</div>
`;

console.log("Valid input test:", validateSolution(neonRainChallenge, validHTML));
console.log("Invalid input test:", validateSolution(neonRainChallenge, invalidHTML));

// TEST 2: Spectrum Spinner CSS Challenge
console.log("\n--- TEST 2: Spectrum Spinner CSS ---");
const validCSS = `
.spinner {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
`;
const invalidCSS = `
.spinner {
    width: 50px;
}
`;

console.log("Valid input test:", validateSolution(spectrumSpinnerChallenge, validCSS));
console.log("Invalid input test:", validateSolution(spectrumSpinnerChallenge, invalidCSS));

// TEST 3: Prismatic Wave JS Challenge
console.log("\n--- TEST 3: Prismatic Wave JS ---");
const validJS = `
const shifter = document.getElementById('color-shifter');
shifter.addEventListener('click', () => {
    document.body.style.backgroundColor = 'hsl(120, 80%, 50%)';
});
`;
const invalidJS = `
console.log("Not shifter");
`;

console.log("Valid input test:", validateSolution(prismaticWaveChallenge, validJS));
console.log("Invalid input test:", validateSolution(prismaticWaveChallenge, invalidJS));

console.log("\n=== ALL UNIT TESTS COMPLETED SUCCESSFULLY ===");
