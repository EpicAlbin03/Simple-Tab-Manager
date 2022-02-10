// Runs when chrome extension is installed, updated or if chrome is updated
chrome.runtime.onInstalled.addListener((data) => {
  // Runs only when chrome extension is installed
  if (data.reason === "install") {
    // Opens website when extension is installed
    chrome.tabs.create({
      url: "https://epicalbin03.github.io/simpletabmanager/",
      active: true,
    });

    // Save variables in storage (default values)
    chrome.storage.sync.set({
      groupOption: "addGroup",
      sortOption: "titleSort",
      autoSort: false,
      autoSortSec: 0,
      autoSortMin: 0,
      autoSortHours: 0,
      preserveGroupOrder: true,
    });
  }
});

// Opens a google form when extension is uninstalled
chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/e/1FAIpQLSeWrvbjLACyM89LGy-7VOdm_pN-O8yIA9FSotfwSq24uzF6KQ/viewform?usp=pp_url&entry.1558238205=Not+using+it+anymore"
);
