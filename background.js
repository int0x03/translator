async function callLLMApi(url, token, modelName, sourceText, callback) {
    try {
        const promptData = await chrome.storage.sync.get('prompt');
        const prompt = promptData.prompt || 'Please translate the following text to Chinese: ';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        };
        const data = {
            "model": modelName,
            "messages": [
                {
                    "role": "user",
                    "content": prompt + sourceText
                }
            ]
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData.error) {
            callback({ status: "error", data: responseData.error.message});
        } else {
            callback({ status: "success", data: responseData.choices[0].message.content });
        }
    } catch (error) {
        callback({ status: "error", data: "Error: " + error });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translate") {
        const content = request.content;
        chrome.storage.sync.get(['apiUrl', 'apiToken', 'modelName'], (items) => {
            const url = items.apiUrl || 'https://openrouter.ai/api/v1/chat/completions';
            const token = items.apiToken || 'sk-or-v1-0-0-0-0';
            const model_name = items.modelName || 'deepseek/deepseek-r1';

            callLLMApi(url, token, model_name, content, sendResponse);
        });

        return true;
    }
});