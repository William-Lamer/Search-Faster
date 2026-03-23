chrome.runtime.onMessage.addListener((message) => {
    if (message.openBackgroundTab) {
        chrome.tabs.create({
            url: message.openBackgroundTab,
            active: false
        });
    }
});
