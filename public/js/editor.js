// Configure Monaco Loader
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

let editor;

require(['vs/editor/editor.main'], function () {
    // Initialize Monaco Editor
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: levelData.initialCode,
        language: levelData.language || 'html',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 18,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 20 }
    });

    // Update preview on content change
    editor.onDidChangeModelContent(() => {
        updatePreview();
    });

    // Initial preview
    updatePreview();
});

function updatePreview() {
    const code = editor.getValue();
    const iframe = document.getElementById('preview-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(code);
    iframeDoc.close();

    // Sync with hidden input
    document.getElementById('code-input').value = code;
}

// Tab Switching Logic
const tabEditor = document.getElementById('tab-editor');
const tabInstructions = document.getElementById('tab-instructions');
const editorContainer = document.getElementById('editor-container');
const instructionsContainer = document.getElementById('instructions-container');

tabEditor.addEventListener('click', () => {
    tabEditor.classList.add('active');
    tabInstructions.classList.remove('active');
    editorContainer.classList.remove('hidden');
    instructionsContainer.classList.add('hidden');
});

tabInstructions.addEventListener('click', () => {
    tabInstructions.classList.add('active');
    tabEditor.classList.remove('active');
    editorContainer.classList.add('hidden');
    instructionsContainer.classList.remove('hidden');
});
