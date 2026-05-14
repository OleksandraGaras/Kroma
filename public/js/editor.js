// Configure Monaco Loader
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

let editor;
let htmlModel;
let cssModel;

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

    // Initial preview
    updatePreview();
});

function updatePreview() {
    let html, css;
    
    if (levelData.language === 'css') {
        html = htmlModel.getValue();
        css = cssModel.getValue();
    } else {
        html = editor.getValue();
        css = '';
    }

    const iframe = document.getElementById('preview-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    const fullCode = `
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `;

    iframeDoc.open();
    iframeDoc.write(fullCode);
    iframeDoc.close();

    // Sync with hidden input (we only send the CSS for CSS levels)
    document.getElementById('code-input').value = (levelData.language === 'css') ? css : html;
}

// Tab Switching Logic
const tabEditor = document.getElementById('tab-editor');
const tabHtml = document.getElementById('tab-html');
const tabCss = document.getElementById('tab-css');
const tabInstructions = document.getElementById('tab-instructions');
const editorContainer = document.getElementById('editor-container');
const instructionsContainer = document.getElementById('instructions-container');

function deactivateAll() {
    [tabEditor, tabHtml, tabCss, tabInstructions].forEach(t => t && t.classList.remove('active'));
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
        editor.updateOptions({ readOnly: true });
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

tabInstructions.addEventListener('click', () => {
    deactivateAll();
    tabInstructions.classList.add('active');
    instructionsContainer.classList.remove('hidden');
});
