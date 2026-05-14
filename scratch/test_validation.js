const { JSDOM } = require('jsdom');

function validateSolution(level, submittedCode) {
  const { validationType, validationTests, solutionCode } = level;

  if (validationType === 'literal' || !validationType) {
    const normalizedSolution = solutionCode.replace(/\s/g, '').toLowerCase();
    const normalizedSubmission = submittedCode.replace(/\s/g, '').toLowerCase();
    return normalizedSubmission.includes(normalizedSolution);
  }

  if (validationType === 'dom') {
    const dom = new JSDOM(submittedCode);
    const document = dom.window.document;

    for (const test of validationTests) {
      const element = document.querySelector(test.selector);

      if (test.type === 'selectorExists') {
        if (!element) return { success: false, message: test.message };
      }

      if (test.type === 'textContentMatch') {
        if (!element) return { success: false, message: test.message };
        const text = element.textContent.trim().toLowerCase();
        const expected = test.expected.trim().toLowerCase();
        if (text !== expected) return { success: false, message: test.message };
      }
    }
    return { success: true };
  }
}

const level1 = {
  validationType: "dom",
  validationTests: [
    { type: "selectorExists", selector: "h1", message: "Missing h1" },
    { type: "textContentMatch", selector: "h1", expected: "Hola Món!", message: "Wrong text" }
  ]
};

console.log("Test 1 (Exact):", validateSolution(level1, "<h1>Hola Món!</h1>"));
console.log("Test 2 (Spaces/Case):", validateSolution(level1, "<H1>  hola món!  </H1>"));
console.log("Test 3 (Extra Content):", validateSolution(level1, "<div><header><h1>Hola Món!</h1></header></div>"));
console.log("Test 4 (Incorrect):", validateSolution(level1, "<h1>Hello World</h1>"));
console.log("Test 5 (Missing Tag):", validateSolution(level1, "<p>Hola Món!</p>"));
