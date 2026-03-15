chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: command });
    });

});

