// Configure Monaco Loader
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

let editor;
let htmlModel;
let cssModel;
let jsModel;

require(['vs/editor/editor.main'], function () {
    const container = document.getElementById('editor-container');
    
    if (levelData.language === 'css') {
        // Create two models
        htmlModel = monaco.editor.createModel(levelData.htmlContext, 'html');
        cssModel = monaco.editor.createModel(levelData.initialCode, 'css');

        editor = monaco.editor.create(container, {
            model: cssModel,
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 18,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 20 }
        });

        cssModel.onDidChangeContent(() => updatePreview());
    } else if (levelData.language === 'javascript') {
        // Create three models
        htmlModel = monaco.editor.createModel(levelData.htmlContext || '', 'html');
        cssModel = monaco.editor.createModel(levelData.cssContext || '', 'css');
        jsModel = monaco.editor.createModel(levelData.initialCode, 'javascript');

        editor = monaco.editor.create(container, {
            model: jsModel,
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 18,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 20 }
        });

        // For JS, we ONLY update when the "Run" button is clicked
        // We still sync the models for preview if they change HTML/CSS, but we won't trigger the JS alert loop
        jsModel.onDidChangeContent(() => {
             // Just sync the hidden input, but don't run the code yet
             document.getElementById('code-input').value = jsModel.getValue();
        });
    } else {
        editor = monaco.editor.create(container, {
            value: levelData.initialCode,
            language: levelData.language || 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 18,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 20 }
        });

        editor.onDidChangeModelContent(() => updatePreview());
    }

    // Run button listener
    const runBtn = document.getElementById('run-btn');
    if (runBtn) {
        runBtn.addEventListener('click', () => updatePreview());
    }

    // Initial preview
    updatePreview();
});

function updatePreview() {
    let html, css, js = '';
    
    if (levelData.language === 'css') {
        html = htmlModel.getValue();
        css = cssModel.getValue();
    } else if (levelData.language === 'javascript') {
        html = htmlModel.getValue();
        css = cssModel.getValue();
        js = jsModel.getValue();
    } else {
        html = editor.getValue();
        css = '';
    }

    const iframe = document.getElementById('preview-iframe');
    const terminalOutput = document.getElementById('terminal-output');
    
    // Clear terminal on each update
    if (terminalOutput) {
        terminalOutput.innerHTML = '<div style="color: #888; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px;">Console Output:</div>';
    }

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

    const fullHtml = `
        <!DOCTYPE html>
        <html>
            <head>
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

    // Use Blob URL for better isolation and performance with sandbox
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Clean up old URL if it exists to avoid memory leaks
    if (iframe._oldUrl) URL.revokeObjectURL(iframe._oldUrl);
    iframe._oldUrl = url;
    
    iframe.src = url;

    // Sync with hidden input
    if (levelData.language === 'javascript') {
        document.getElementById('code-input').value = js;
    } else if (levelData.language === 'css') {
        document.getElementById('code-input').value = css;
    } else {
        document.getElementById('code-input').value = html;
    }
}

// Terminal & Alert Listener
window.addEventListener('message', (event) => {
    const terminalOutput = document.getElementById('terminal-output');
    const { type, logs } = event.data;
    if (!type || !logs) return;

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

    // Auto-scroll to bottom
    const container = terminalOutput.parentElement;
    container.scrollTop = container.scrollHeight;
});

// Tab Switching Logic
const tabEditor = document.getElementById('tab-editor');
const tabHtml = document.getElementById('tab-html');
const tabCss = document.getElementById('tab-css');
const tabJs = document.getElementById('tab-js');
const tabInstructions = document.getElementById('tab-instructions');
const editorContainer = document.getElementById('editor-container');
const instructionsContainer = document.getElementById('instructions-container');

function deactivateAll() {
    [tabEditor, tabHtml, tabCss, tabJs, tabInstructions].forEach(t => t && t.classList.remove('active'));
    editorContainer.classList.add('hidden');
    instructionsContainer.classList.add('hidden');
}

if (tabEditor) {
    tabEditor.addEventListener('click', () => {
        deactivateAll();
        tabEditor.classList.add('active');
        editorContainer.classList.remove('hidden');
    });
}

if (tabHtml) {
    tabHtml.addEventListener('click', () => {
        deactivateAll();
        tabHtml.classList.add('active');
        editorContainer.classList.remove('hidden');
        editor.setModel(htmlModel);
        // Allow editing if it's JS level? The user said "one for each so the user know what he is doing".
        // Let's keep it read-only for CSS levels, but maybe editable for JS levels?
        // Actually, let's keep it editable for JS levels as well if they want to experiment.
        editor.updateOptions({ readOnly: levelData.language === 'css' });
    });
}

if (tabCss) {
    tabCss.addEventListener('click', () => {
        deactivateAll();
        tabCss.classList.add('active');
        editorContainer.classList.remove('hidden');
        editor.setModel(cssModel);
        editor.updateOptions({ readOnly: false });
    });
}

if (tabJs) {
    tabJs.addEventListener('click', () => {
        deactivateAll();
        tabJs.classList.add('active');
        editorContainer.classList.remove('hidden');
        editor.setModel(jsModel);
        editor.updateOptions({ readOnly: false });
    });
}

tabInstructions.addEventListener('click', () => {
    deactivateAll();
    tabInstructions.classList.add('active');
    instructionsContainer.classList.remove('hidden');
});

