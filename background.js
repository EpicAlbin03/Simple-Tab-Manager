// Runs when chrome extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Save variables in storage (default values)
  chrome.storage.sync.set({
    groupOption: "addGroup",
    sortOption: "titleSort",
    autoSort: false,
    autoSortSec: 0,
    autoSortMin: 0,
    autoSortHours: 0,
    selectGrouping: "leftToRight",
    preserveGroupOrder: false,
  });
});

// Runs foreground.js when new http or https website is opened
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./foreground.js"],
      })
      .then(() => {
        console.log("injected foreground.js");
      })
      .catch((error) => console.log(error));
  }
});
