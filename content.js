chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_first_result"){
        const firstResult = document.querySelector(".zReHs");
        if (firstResult){
            firstResult.click();
        }
    }

    if (request.action === "open_first_result_new_tab"){
        const firstResult = document.querySelector(".zReHs");
        if (firstResult){
            window.open(firstResult.href, "_blank");
        }
    }



});
