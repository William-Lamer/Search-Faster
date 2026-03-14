chrome.commands.onCommand.addListener((command) => {
    console.log(`Command: ${command}`);
    //if (command === "open_first_result") {
    //    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    //        chrome.tabs.sendMessage(tabs[0].id, {action: "openFirst"});
    //   });
    //}
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: command });
    });

});

