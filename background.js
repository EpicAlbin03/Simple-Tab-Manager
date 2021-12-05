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
    preserveGroupOrder: false,
  });
});
