chrome.runtime.onInstalled.addListener(() => { // Runs when chrome extension is installed
    chrome.storage.local.set({ // Save variables in storage (default values)
        example: "example"
    });
});

chrome.storage.local.get('example', data => { // Load variables from storage

});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { // Runs foreground.js when new http or https website is opened
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./foreground.js"]
        })
            .then(() => {
                console.log("injected foreground.js");
            })
            .catch(error => console.log(error));
    }
});