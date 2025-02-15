function appendTranslatedText(text, originParagraph) {
    const newParagraph = document.createElement('p');
    newParagraph.classList.add('translator-p');
    newParagraph.textContent = text;
    originParagraph.parentNode.insertBefore(newParagraph, originParagraph.nextSibling);
}

function wrapParagraph(paragraph) {
    const tIcon = document.createElement('span');
    const paragraphText = paragraph.textContent;
    if ("" == paragraphText.trim() || paragraphText.trim().split(" ").length < 2) {
        return;
    }

    tIcon.classList.add('translator-icon');

    tIcon.addEventListener('dblclick', () => {
        tIcon.classList.add('translator-icon-animate-rotate');
        chrome.runtime.sendMessage({ action: "translate", content: paragraphText }, function (response) {
            if (response.status === "success") {
                appendTranslatedText(response.data, paragraph);
            } else {
                appendTranslatedText("Error: " + response.data, paragraph);
            }
            tIcon.classList.remove('translator-icon-animate-rotate');
        });
    });

    paragraph.appendChild(tIcon);
}

function handleMutations(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'P') {
                    if (node.classList && !node.classList.contains('translator-p')) {
                        wrapParagraph(node);
                    }
                } else if (node.querySelectorAll) {
                    const pTags = node.querySelectorAll('p');
                    pTags.forEach(pTag => {
                        wrapParagraph(pTag);
                    });
                }
            });
        }
    }
}

window.addEventListener('load', () => {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(paragraph => wrapParagraph(paragraph));
    
    const observer = new MutationObserver(handleMutations);
    const targetNode = document.body;
    const config = { 
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };
    
    observer.observe(targetNode, config);
});
