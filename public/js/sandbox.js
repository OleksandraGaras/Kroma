// Configure Monaco Loader
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

let editor;
let htmlModel;
let cssModel;
let jsModel;

// Beautiful initial starting code for Sandbox
const initialHtml = `<!-- Welcome to the Kroma Coding Sandbox! -->
<div class="sandbox-container">
  <h1>KROMA SANDBOX 🚀</h1>
  <p>Here you can freely experiment with HTML, CSS, and JavaScript simultaneously!</p>
  
  <div class="card">
    <p>Click the button below to trigger the custom JavaScript engine and terminal logging.</p>
    <button id="test-btn">Interact & Log ⚡</button>
  </div>
</div>
`;

const initialCss = `/* Write your custom styles here */
body {
  background: radial-gradient(circle at center, #150808 0%, #050202 100%);
  color: #eee;
  font-family: 'Outfit', 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
}

.sandbox-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  max-width: 500px;
}

h1 {
  background: linear-gradient(135deg, #ff3333, #ffcc00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

p {
  color: #b0b0b0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.card {
  margin-top: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

button {
  margin-top: 15px;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  background: linear-gradient(135deg, #00ff00, #00ffcc);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 20px rgba(0, 255, 0, 0.5);
}
`;

const initialJs = `// Write your JavaScript logic here
console.log("Kroma Sandbox initialized! Try clicking the button below...");

const btn = document.getElementById('test-btn');
if (btn) {
  btn.addEventListener('click', () => {
    // Log info directly to Kroma's integrated console terminal
    console.log("Button clicked! Triggering alert modal...");
    
    // Test the browser alert interceptor
    alert("Awesome! You are successfully running code in Kroma Sandbox! 🚀");
    
    console.warn("This is a warning log message.");
    console.error("This is an error log message, showing styling compatibility!");
  });
}
`;

require(['vs/editor/editor.main'], function () {
    const container = document.getElementById('editor-container');
    
    // Create distinct models
    htmlModel = monaco.editor.createModel(initialHtml, 'html');
    cssModel = monaco.editor.createModel(initialCss, 'css');
    jsModel = monaco.editor.createModel(initialJs, 'javascript');

    // Initialize Monaco Editor with the HTML model active
    editor = monaco.editor.create(container, {
        model: htmlModel,
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 18,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 20 }
    });

    // Run button listener
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
        runBtn.addEventListener('click', () => updatePreview());
    }

    // Auto-update HTML and CSS changes in the preview immediately
    htmlModel.onDidChangeContent(() => updatePreview());
    cssModel.onDidChangeContent(() => updatePreview());

    // Initial render
    updatePreview();
});

function updatePreview() {
    if (!htmlModel || !cssModel || !jsModel) return;

    const html = htmlModel.getValue();
    const css = cssModel.getValue();
    const js = jsModel.getValue();

    const iframe = document.getElementById('preview-iframe');
    const terminalOutput = document.getElementById('terminal-output');
    
    // Reset integrated console output
    if (terminalOutput) {
        terminalOutput.innerHTML = '<div style="color: #888; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px;">Console Output:</div>';
    }

    // Capture logs and alerts inside the iframe and send them to parent window
    const interceptorScript = `
        <script>
            (function() {
                const sendToParent = (type, args) => {
                    window.parent.postMessage({
                        type: type,
                        logs: args.map(arg => {
                            try {
                                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                            } catch(e) {
                                return "[Unserializable Object]";
                            }
                        })
                    }, '*');
                };

                console.log = (...args) => sendToParent('CONSOLE_LOG', args);
                console.error = (...args) => sendToParent('CONSOLE_ERROR', args);
                console.warn = (...args) => sendToParent('CONSOLE_WARN', args);
                
                window.alert = (message) => {
                    sendToParent('USER_ALERT', [message]);
                };

                window.onerror = (message, source, lineno, colno, error) => {
                    sendToParent('CONSOLE_ERROR', [message]);
                };
            })();
        </script>
    `;

    // Construct the unified HTML document with injected styles and scripts
    const fullHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <style>${css}</style>
                ${interceptorScript}
            </head>
            <body>
                ${html}
                <script>
                    (function() {
                        try {
                            ${js.replace(/<\/script>/g, '<\\/script>')}
                        } catch (e) {
                            console.error(e.message);
                        }
                    })();
                </script>
            </body>
        </html>
    `;

    // Package as safe Blob URL
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    if (iframe._oldUrl) URL.revokeObjectURL(iframe._oldUrl);
    iframe._oldUrl = url;
    
    iframe.src = url;
}

// Receive messages from isolated sandboxed iframe
window.addEventListener('message', (event) => {
    const terminalOutput = document.getElementById('terminal-output');
    const { type, logs } = event.data;
    if (!type || !logs) return;

    // Intercept alert requests to show premium custom modal
    if (type === 'USER_ALERT') {
        const modal = document.getElementById('custom-alert-modal');
        const messageEl = document.getElementById('custom-alert-message');
        if (modal && messageEl) {
            messageEl.innerText = logs[0];
            modal.classList.remove('hidden');
        }
        return;
    }

    if (!terminalOutput) return;

    // Render console statements in the terminal
    logs.forEach(log => {
        const line = document.createElement('div');
        line.style.marginBottom = '4px';
        line.style.whiteSpace = 'pre-wrap';
        line.style.wordBreak = 'break-all';

        if (type === 'CONSOLE_LOG') {
            line.innerText = `> ${log}`;
            line.style.color = '#00ff00';
        } else if (type === 'CONSOLE_ERROR') {
            line.innerText = `❌ Error: ${log}`;
            line.style.color = '#ff6b6b';
        } else if (type === 'CONSOLE_WARN') {
            line.innerText = `⚠️ Warn: ${log}`;
            line.style.color = '#ffd93d';
        }
        
        terminalOutput.appendChild(line);
    });

    // Auto-scroll console container to the latest statement
    const container = terminalOutput.parentElement;
    container.scrollTop = container.scrollHeight;
});

// Pestañas (Tab switching) logic
const tabHtml = document.getElementById('tab-html');
const tabCss = document.getElementById('tab-css');
const tabJs = document.getElementById('tab-js');

function deactivateAll() {
    [tabHtml, tabCss, tabJs].forEach(t => t && t.classList.remove('active'));
}

if (tabHtml) {
    tabHtml.addEventListener('click', () => {
        deactivateAll();
        tabHtml.classList.add('active');
        editor.setModel(htmlModel);
    });
}

if (tabCss) {
    tabCss.addEventListener('click', () => {
        deactivateAll();
        tabCss.classList.add('active');
        editor.setModel(cssModel);
    });
}

if (tabJs) {
    tabJs.addEventListener('click', () => {
        deactivateAll();
        tabJs.classList.add('active');
        editor.setModel(jsModel);
    });
}
