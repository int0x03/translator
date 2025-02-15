document.getElementById('save-button').addEventListener('click', () => {
    const prompt = document.getElementById('prompt').value;
    const apiUrl = document.getElementById('api-url').value;
    const apiToken = document.getElementById('api-token').value;
    const modelName = document.getElementById('model-name').value;

    chrome.storage.sync.set({
        prompt: prompt,
        apiUrl: apiUrl,
        apiToken: apiToken,
        modelName: modelName
    }, () => {
        alert('Settings saved');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['prompt', 'apiUrl', 'apiToken', 'modelName'], (items) => {
        document.getElementById('prompt').value = items.prompt || 'Please translate the following text to Chinese: ';
        document.getElementById('api-url').value = items.apiUrl || 'https://openrouter.ai/api/v1/chat/completions';
        document.getElementById('api-token').value = items.apiToken || 'sk-or-v1-0-0-0-0';
        document.getElementById('model-name').value = items.modelName || 'deepseek/deepseek-r1';
    });
});